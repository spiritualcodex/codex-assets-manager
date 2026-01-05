// codex-assets-manager/src/match/bridge.ts

import { fetchScanReport, fetchEligibility, fetchBindPreview } from '../office/adapters';
import { issueExecutionGate, verifyExecutionGate } from '../execution/execution-gate.service';

export interface MatchState {
    squad: any;        // ScanReport
    clearance: any;    // Eligibility
    registration: any; // BindPreview
    gateToken: any;    // ExecutionGateToken (Signed)
    status: 'STOPPED' | 'READY' | 'PLAYING';
}

/**
 * Builds the Authoritative Match State from Vault Truth.
 * Phase 4 Upgrade: Uses Signed Execution Gate.
 */
export async function buildMatchState(ingestId: string): Promise<MatchState> {
    // 1. Fetch Context
    const [squad, clearance, registration] = await Promise.all([
        fetchScanReport(ingestId),
        fetchEligibility(ingestId),
        fetchBindPreview(ingestId)
    ]);

    const baseState: MatchState = {
        squad,
        clearance,
        registration,
        gateToken: null,
        status: 'STOPPED'
    };

    if (!squad || !clearance || !registration) {
        console.warn("Match Bridge: Missing prerequisites. STOPPED.");
        return baseState;
    }

    // 2. Request Execution Gate Token (The "Referee Whistle")
    const gateToken = await issueExecutionGate(ingestId, 'Match-Bridge');

    // 3. Verify Token Integrity (Anti-Gravity Check)
    if (!gateToken.decision.allowed || !verifyExecutionGate(gateToken)) {
        console.warn("Match Bridge: Execution Gate invalid or denied. STOPPED.");
        return { ...baseState, gateToken, status: 'STOPPED' };
    }

    // 4. System Green
    console.log("Match Bridge: Valid Signed Gate. Match READY.");
    return { ...baseState, gateToken, status: 'READY' };
}
