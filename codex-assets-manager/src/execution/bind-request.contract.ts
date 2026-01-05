// codex-assets-manager/src/execution/bind-request.contract.ts

/**
 * TACTICAL AGENT REQUEST
 * Authority: Read-Only / Intent
 * 
 * Agents signal "I want to play" via this contract.
 * Vault decides if authorization is granted (asynchronously).
 */

export interface BindRequest {
    agentId: string;
    ingestId: string;
    requestedScope: string[];
    justification: string;
    timestamp: string;
}

export interface BindRequestReceipt {
    requestId: string;
    status: 'PENDING_VAULT_APPROVAL';
    auditLog: string;
}
