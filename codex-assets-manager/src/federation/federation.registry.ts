// codex-assets-manager/src/federation/federation.registry.ts

import { FederationScope } from './federation.contract';

const ACTIVE_ENVIRONMENTS = new Map<string, FederationScope>();

// Seed with default environments
ACTIVE_ENVIRONMENTS.set('core-local', {
    envId: 'core-local',
    type: 'LOCAL',
    region: 'localhost',
    allowedCapabilities: ['read', 'compute', 'simulate']
});

ACTIVE_ENVIRONMENTS.set('render-prod', {
    envId: 'render-prod',
    type: 'PRODUCTION',
    region: 'us-east-1',
    allowedCapabilities: ['read', 'compute', 'net-out', 'persist']
});

export const FederationRegistry = {
    getEnvironment(envId: string): FederationScope | undefined {
        return ACTIVE_ENVIRONMENTS.get(envId);
    },

    validateCapability(envId: string, capability: string): boolean {
        const env = this.getEnvironment(envId);
        if (!env) return false;
        return env.allowedCapabilities.includes(capability);
    }
};
