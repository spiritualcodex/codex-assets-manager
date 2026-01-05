// codex-assets-manager/src/federation/federation.contract.ts

/**
 * FEDERATION CONTRACT
 * Authority: Vault
 * 
 * Defines isolated execution environments.
 */

export type EnvironmentType = 'LOCAL' | 'STAGING' | 'PRODUCTION' | 'EDGE_SANDBOX';

export interface FederationScope {
    envId: string;
    type: EnvironmentType;
    region: string;
    allowedCapabilities: string[]; // e.g., ['read', 'compute'] vs ['read', 'compute', 'net-out']
}

export interface FederatedGateContext {
    federationId: string; // The specific environment authorization
    parentVaultId: string; // Root of Trust
}
