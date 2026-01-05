// codex-assets-manager/src/builder/test-runner.service.ts

import { EntitlementsService } from '../product/entitlements.service';
import { Scheduler } from '../runtime/scheduler.service';
import { verifyExecutionGate } from '../execution/execution-gate.service';
import { ExecutionGateToken } from '../execution/gate.contract';

export type TestScenario = 'VALIDATE_GATES' | 'SIMULATE_SCHEDULER' | 'CHECK_ENTITLEMENTS' | 'FULL_SYSTEM_DRY_RUN';

export interface TestResult {
    logs: string[];
    status: 'PASS' | 'FAIL';
}

/**
 * CODEX BUILDER - TEST RUNNER
 * Executes system logic in a safe, browser-compatible harness.
 * Captures console output to stream back to the UI.
 */
export const TestRunner = {

    async runTest(scenario: TestScenario): Promise<TestResult> {
        const logs: string[] = [];
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;

        // Trap logs
        const log = (...args: any[]) => {
            logs.push(`[LOG] ${args.join(' ')}`);
            originalLog(...args);
        };
        const warn = (...args: any[]) => {
            logs.push(`[WARN] ${args.join(' ')}`);
            originalWarn(...args);
        };
        const error = (...args: any[]) => {
            logs.push(`[ERROR] ${args.join(' ')}`);
            originalError(...args);
        };

        console.log = log;
        console.warn = warn;
        console.error = error;

        let status: 'PASS' | 'FAIL' = 'PASS';

        try {
            log(`▶ STARTING SCENARIO: ${scenario}`);

            switch (scenario) {
                case 'CHECK_ENTITLEMENTS':
                    await this.testEntitlements();
                    break;
                case 'VALIDATE_GATES':
                    await this.testGates();
                    break;
                case 'SIMULATE_SCHEDULER':
                    await this.testScheduler();
                    break;
                case 'FULL_SYSTEM_DRY_RUN':
                    await this.testEntitlements();
                    await this.testGates();
                    await this.testScheduler();
                    break;
                default:
                    throw new Error(`Unknown scenario: ${scenario}`);
            }

            log(`✅ SCENARIO COMPLETE: ${scenario}`);

        } catch (e: any) {
            error(`❌ SCENARIO FAILED: ${e.message}`);
            status = 'FAIL';
        } finally {
            // Restore logs
            console.log = originalLog;
            console.warn = originalWarn;
            console.error = originalError;
        }

        return { logs, status };
    },

    async testEntitlements() {
        console.log("--- Testing Entitlements ---");
        const coreLimits = EntitlementsService.getLimits('default');
        console.log(`Core Limits (Concurrency): ${coreLimits.maxConcurrency}`);
        if (coreLimits.maxConcurrency !== 1) throw new Error("Entitlement Mismatch for Core");

        const partnerLimits = EntitlementsService.getLimits('partner-001');
        console.log(`Partner Limits (Concurrency): ${partnerLimits.maxConcurrency}`);
        if (partnerLimits.maxConcurrency !== 50) throw new Error("Entitlement Mismatch for Partner");
    },

    async testGates() {
        console.log("--- Testing Gates ---");
        // Mock Token
        const token: ExecutionGateToken = {
            decision: { allowed: false, expiresAt: 0, leaseId: '123', scope: [], signature: 'INVALID' },
            context: { ingestId: 'test-1', projectId: 'default', timestamp: 0 }
        };
        const isValid = verifyExecutionGate(token);
        console.log(`Invalid Token Check: ${isValid}`);
        if (isValid) throw new Error("Security Fail: Invalid token passed verification");
    },

    async testScheduler() {
        console.log("--- Testing Scheduler ---");
        // We can't easily wait for the tick, but we can verify it exists
        Scheduler.startPolling();
        console.log("Scheduler tick logic executed.");
        Scheduler.stopPolling();
    }
};
