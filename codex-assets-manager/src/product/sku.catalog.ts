// codex-assets-manager/src/product/sku.catalog.ts

export type SkuType = 'SKU_CORE' | 'SKU_PRO' | 'SKU_ENTERPRISE' | 'SKU_PARTNER';

export interface SkuLimits {
    maxConcurrency: number;
    federationAllowed: boolean;
    auditDataExport: boolean;
    environments: string[];
    retentionDays: number;
}

export const SKU_DEFINITIONS: Record<SkuType, SkuLimits> = {
    SKU_CORE: {
        maxConcurrency: 1,
        federationAllowed: false,
        auditDataExport: false,
        environments: ['local'],
        retentionDays: 7
    },
    SKU_PRO: {
        maxConcurrency: 5,
        federationAllowed: false,
        auditDataExport: true,
        environments: ['local', 'production'],
        retentionDays: 30
    },
    SKU_ENTERPRISE: {
        maxConcurrency: 20,
        federationAllowed: true,
        auditDataExport: true,
        environments: ['local', 'production', 'edge'],
        retentionDays: 365
    },
    SKU_PARTNER: {
        maxConcurrency: 50,
        federationAllowed: true, // Partners often need cross-env
        auditDataExport: false, // Partners act, they don't audit
        environments: ['sandbox'],
        retentionDays: 1
    }
};
