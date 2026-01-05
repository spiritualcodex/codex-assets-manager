// codex-assets-manager/src/execution/gate.contract.ts

/**
 * EXECUTION GATE CONTRACT
 * Authority: Vault
 * 
 * Represents a cryptographically signed authorization for Anti-Gravity to execute.
 * Immutable once issued.
 */

export interface ExecutionGateContext {
    ingestId: string;
    requester: string; // e.g., 'Anti-Gravity-Pump'
    timestamp: string;
}

export interface ExecutionGateDecision {
    allowed: boolean;
    leaseId?: string;       // Required if allowed
    scope?: string[];       // e.g., ['read', 'execute', 'net-out']
    expiresAt?: number;     // Unix Timestamp (TTL)
    signature?: string;     // HMAC-SHA256(leaseId + expiresAt + scope)
    reason?: string;        // If denied
}

/**
 * Canonical Gate Token
 * This object is what Anti-Gravity holds.
 */
export interface ExecutionGateToken {
    decision: ExecutionGateDecision;
    context: ExecutionGateContext;
    auditId: string;
}
