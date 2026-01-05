// codex-assets-manager/src/office/adapters/audit.adapter.ts
import { ComplianceService, AuditRecord } from '../../audit/compliance.service';

/**
 * Read-Only Adapter for Auditor Views.
 */
export const fetchAuditLog = async (): Promise<AuditRecord[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const logs = ComplianceService.exportLog();
    console.log(`🔎 [AUDIT-VIEW] Fetched ${logs.length} immutable records.`);
    return logs;
};
