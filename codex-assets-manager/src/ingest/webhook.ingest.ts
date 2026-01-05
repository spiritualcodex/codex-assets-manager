// codex-assets-manager/src/ingest/webhook.ingest.ts

// Intent Record - The normalized signal
export interface IntentRecord {
    intentId: string;
    source: 'GITHUB' | 'STRIPE' | 'MANUAL' | 'CI' | 'CMS' | 'ADS';
    payload: any;
    timestamp: number;
    verified: boolean;
}

const PROCESSED_NONCES = new Set<string>();

export const WebhookIngest = {
    /**
     * Safe Ingest Point.
     * 1. Validate Sig
     * 2. Check Replay
     * 3. Normalize
     */
    receive(source: string, payload: any, signature: string, nonce: string): IntentRecord | null {
        console.log(`📡 [WEBHOOK] Receiving signal from ${source}`);

        // 1. Replay Protection
        if (PROCESSED_NONCES.has(nonce)) {
            console.warn(`🛑 [WEBHOOK] Replay Detected: ${nonce}`);
            return null;
        }
        PROCESSED_NONCES.add(nonce);

        // 2. Signature Validation (Mock)
        if (!this.verifySignature(payload, signature)) {
            console.warn(`🛑 [WEBHOOK] Invalid Signature`);
            return null;
        }

        // 3. Normalize
        const intentId = `INTENT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const record: IntentRecord = {
            intentId,
            source: source as any,
            payload,
            timestamp: Date.now(),
            verified: true
        };

        console.log(`✅ [WEBHOOK] Intent Captured: ${intentId}`);
        return record;
    },

    verifySignature(payload: any, signature: string): boolean {
        // In real world: crypto.verify(...)
        // Verification: signature must start with "SIG_"
        // Phase 10: Source-specific validation
        if (payload.token && payload.token.startsWith('ci_')) return true; // Mock CI
        return signature.startsWith('SIG_');
    }
};
