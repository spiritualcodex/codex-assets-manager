// codex-assets-manager/src/office/adapters/index.ts

// Mock Vault Source for prototyping - In real system this hits the Vault API
const VAULT_SOURCE = {
    scan: {
        providers: ['Oracle', 'Sanctum'],
        runtime: 'cloud-v1',
        filesScanned: ['file1.js', 'file2.js'],
        integrity: 'SHA-256:VALID'
    },
    eligibility: {
        allowed: true,
        reasons: ['Providers Verified', 'Audit Logged', 'Runtime Secure'],
        timestamp: new Date().toISOString()
    },
    bind: {
        leaseId: 'lease-8812',
        ttl: 3600,
        scope: 'read-execution-state',
        audience: ['Tactical-Agents', 'Office-Manager']
    },
    gate: {
        status: 'OPEN',
        allowed: true,
        message: 'Match execution authorized.'
    }
};

// HELPER: Fail Closed Wrapper
async function safeFetch<T>(fn: () => T, timeoutMs: number = 2000): Promise<T | null> {
    try {
        const promise = new Promise<T>((resolve) => {
            setTimeout(() => resolve(fn()), 100); // Simulate network latency
        });

        const timeout = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs);
        });

        return await Promise.race([promise, timeout]);
    } catch (error) {
        console.error("Office Adapter Error:", error);
        return null; // Fail closed
    }
}

// 1. Fetch Scan Report
export async function fetchScanReport(ingestId: string) {
    return safeFetch(() => {
        if (!ingestId) throw new Error("Missing Ingest ID");
        return VAULT_SOURCE.scan;
    });
}

// 2. Fetch Eligibility
export async function fetchEligibility(ingestId: string) {
    return safeFetch(() => {
        if (!ingestId) throw new Error("Missing Ingest ID");
        return VAULT_SOURCE.eligibility;
    });
}

// 3. Fetch Bind Preview
export async function fetchBindPreview(ingestId: string) {
    return safeFetch(() => {
        if (!ingestId) throw new Error("Missing Ingest ID");
        return VAULT_SOURCE.bind;
    });
}

// 4. Fetch Execution Gate
export async function fetchExecutionGate(ingestId: string) {
    return safeFetch(() => {
        if (!ingestId) throw new Error("Missing Ingest ID");

        // Strict Gate Logic
        const isEligible = VAULT_SOURCE.eligibility.allowed;
        const hasBind = !!VAULT_SOURCE.bind.leaseId;

        if (isEligible && hasBind) {
            return { allowed: true, status: 'GREEN' };
        } else {
            return { allowed: false, status: 'RED_LOCK' };
        }
    });
}
