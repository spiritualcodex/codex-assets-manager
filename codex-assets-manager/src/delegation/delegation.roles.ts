// codex-assets-manager/src/delegation/delegation.roles.ts

export enum Role {
    VIEWER = 'VIEWER',     // Read-only
    OPERATOR = 'OPERATOR', // Can request intent
    AUDITOR = 'AUDITOR',   // Can export logs
    PARTNER = 'PARTNER'    // Sandbox only
}

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
    VIEWER: ['view:ui', 'view:logs'],
    OPERATOR: ['view:ui', 'view:logs', 'request:intent', 'billing:view'],
    AUDITOR: ['view:ui', 'view:logs', 'export:audit'],
    PARTNER: ['view:ui', 'sandbox:execute']
};

export const DelegationService = {
    checkPermission(role: Role, action: string): boolean {
        const permissions = ROLE_PERMISSIONS[role] || [];
        return permissions.includes(action);
    }
};
