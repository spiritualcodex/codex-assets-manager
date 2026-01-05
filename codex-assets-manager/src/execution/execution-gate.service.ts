// codex-assets-manager/src/execution/execution-gate.service.ts

import { ExecutionGateToken, ExecutionGateDecision, ExecutionGateContext } from './gate.contract';
import { fetchEligibility, fetchBindPreview } from '../office/adapters';

const GATE_TTL_SECONDS = 300; // 5 Minutes
const SECRET_KEY = 'vault-mock-secret'; // Logic simulation only

/**
 * Signs the payload (Mock).
 */
function sign(payload: string): string {
    // In real system: crypto.hmac(payload, SECRET_KEY)
    return `SIG_${btoa(payload).substring(0, 16)}`;
}

/**
 * Issues an Execution Gate Token.
 * 
 * Rules:
 * 1. Check Eligibility (Must be TRUE)
 * 2. Check Bind (Must exist)
 * 3. Generate Lease & Expiry
 * 4. Sign
 */
export async function issueExecutionGate(ingestId: string, requester: string): Promise<ExecutionGateToken> {
    const auditId = `AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const context: ExecutionGateContext = {
        ingestId,
        requester,
        timestamp: new Date().toISOString()
    };

    console.log(`[GATE-${auditId}] Request: Issue Token for ${ingestId}`);

    try {
        // 1. Verify Eligibility
        const eligibility = await fetchEligibility(ingestId);
        if (!eligibility || !eligibility.allowed) {
            console.warn(`[GATE-${auditId}] DENIED: Ineligible`);
            return {
                decision: { allowed: false, reason: 'Asset Ineligible' },
                context,
                auditId
            };
        }

        // 2. Verify Bind
        const bind = await fetchBindPreview(ingestId);
        if (!bind || !bind.leaseId) {
            console.warn(`[GATE-${auditId}] DENIED: No Bind Lease`);
            return {
                decision: { allowed: false, reason: 'No Bind Lease' },
                context,
                auditId
            };
        }

        // 3. Issue
        const expiresAt = Math.floor(Date.now() / 1000) + GATE_TTL_SECONDS;
        const scope = bind.scope ? [bind.scope, 'execute'] : ['execute'];
        const signaturePayload = `${bind.leaseId}:${expiresAt}:${scope.join(',')}`;
        const signature = sign(signaturePayload);

        console.log(`[GATE-${auditId}] ISSUED: Valid for ${GATE_TTL_SECONDS}s`);

        return {
            decision: {
                allowed: true,
                leaseId: bind.leaseId,
                expiresAt,
                scope,
                signature
            },
            context,
            auditId
        };

    } catch (error) {
        console.error(`[GATE-${auditId}] ERROR: System Failure`, error);
        return {
            decision: { allowed: false, reason: 'System Fault' },
            context,
            auditId
        };
    }
}

/**
 * Verifies an Execution Gate Token.
 * Used by Anti-Gravity before moving.
 */
export function verifyExecutionGate(token: ExecutionGateToken): boolean {
    if (!token || !token.decision.allowed) return false;

    const { leaseId, expiresAt, scope, signature } = token.decision;

    // 1. Check Expiry
    const now = Math.floor(Date.now() / 1000);
    if (!expiresAt || now > expiresAt) {
        console.warn(`[VERIFY] DENIED: Expired`);
        return false;
    }

    // 2. Check Signature
    const expectedPayload = `${leaseId}:${expiresAt}:${scope?.join(',')}`;
    const expectedSig = sign(expectedPayload);

    if (signature !== expectedSig) {
        console.warn(`[VERIFY] DENIED: Invalid Signature`);
        return false;
    }

    return true;
}
