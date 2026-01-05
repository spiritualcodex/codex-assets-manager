// codex-assets-manager/src/sandbox/public-agent.api.ts

import { perceiveMatchState } from '../match/tactical';

export interface SandboxRequest {
    agentId: string; // Public ID
    targetIngestId: string;
    partnerId?: string;
}

enum PartnerTier {
    BASIC = 'BASIC',
    PARTNER = 'PARTNER'
}

const PARTNER_REGISTRY = new Set<string>();

const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS = 5;
const REQUEST_LOG = new Map<string, number[]>();

export const PublicAgentSandbox = {
    /**
     * Phase 10: Partner Onboarding
     */
    registerPartner(partnerId: string) {
        PARTNER_REGISTRY.add(partnerId);
        console.log(`🤝 [SANDBOX] Partner Onboarded: ${partnerId}`);
    },
    /**
     * Public Entry Point.
     * Completely isolated from Execution Gate.
     */
    async simulate(req: SandboxRequest): Promise<any> {
        // 1. Rate Limit Check
        const tier = req.partnerId && PARTNER_REGISTRY.has(req.partnerId) ? PartnerTier.PARTNER : PartnerTier.BASIC;
        if (!this.checkRateLimit(req.agentId, tier)) {
            throw new Error("RATE_LIMIT_EXCEEDED");
        }

        console.log(`🧸 [SANDBOX] Agent ${req.agentId} observing ${req.targetIngestId}`);

        // 2. Read-Only Perception (Uses safe Tactical Interface)
        const perception = await perceiveMatchState(req.agentId, req.targetIngestId);

        // 3. Sanitation (Remove Internal Secrets if any leaked into state)
        // (mock implementation)

        return {
            perception,
            sandbox: 'PUBLIC_LITE',
            capabilities: ['observe', 'plan']
        };
    },

    checkRateLimit(clientId: string, tier: PartnerTier = PartnerTier.BASIC): boolean {
        const now = Date.now();
        const history = REQUEST_LOG.get(clientId) || [];
        const validHistory = history.filter(ts => now - ts < RATE_LIMIT_WINDOW);

        const limit = tier === PartnerTier.PARTNER ? 50 : 5;
        if (validHistory.length >= limit) return false;

        validHistory.push(now);
        REQUEST_LOG.set(clientId, validHistory);
        return true;
    }
};
