// codex-assets-manager/src/execution/revocation.service.ts

/**
 * ANTI-GRAVITY KILL SWITCH
 * Authority: Vault
 */

const REVOKED_IDS = new Set<string>();

export const RevocationService = {
    /**
     * Hard Kill-Switch.
     * Immediate effect.
     */
    revoke(ingestId: string, reason: string): void {
        console.warn(`🚨 [KILL-SWITCH] REVOKING ${ingestId}. Reason: ${reason}`);
        REVOKED_IDS.add(ingestId);
    },

    isRevoked(ingestId: string): boolean {
        return REVOKED_IDS.has(ingestId);
    },

    /**
     * Phase 5C: Verify before any sensitive op.
     */
    assertNotRevoked(ingestId: string): void {
        if (REVOKED_IDS.has(ingestId)) {
            throw new Error(`EXECUTION REVOKED: ${ingestId}`);
        }
    }
};
