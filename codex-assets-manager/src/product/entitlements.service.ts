// codex-assets-manager/src/product/entitlements.service.ts
import { SkuType, SKU_DEFINITIONS, SkuLimits } from './sku.catalog';

// Mock entitlements DB
const PROJECT_ENTITLEMENTS = new Map<string, SkuType>();

// Seed Data
PROJECT_ENTITLEMENTS.set('default', 'SKU_CORE');
PROJECT_ENTITLEMENTS.set('pro-team', 'SKU_PRO');
PROJECT_ENTITLEMENTS.set('corp-hq', 'SKU_ENTERPRISE');
PROJECT_ENTITLEMENTS.set('partner-001', 'SKU_PARTNER');

export const EntitlementsService = {

    getSku(projectId: string): SkuType {
        return PROJECT_ENTITLEMENTS.get(projectId) || 'SKU_CORE';
    },

    getLimits(projectId: string): SkuLimits {
        const sku = this.getSku(projectId);
        return SKU_DEFINITIONS[sku];
    },

    /**
     * Hard Check: Does project have this feature?
     */
    canUseFeature(projectId: string, feature: keyof SkuLimits): boolean {
        const limits = this.getLimits(projectId);
        return !!limits[feature];
    }
};
