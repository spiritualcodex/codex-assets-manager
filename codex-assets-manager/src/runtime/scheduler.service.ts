// codex-assets-manager/src/runtime/scheduler.service.ts

import { verifyExecutionGate } from '../execution/execution-gate.service';
import { ExecutionGateToken } from '../execution/gate.contract';

// In-memory registry of running processes (for prototype)
const RUNNING_PROCESSES = new Map<string, { startTime: number, token: ExecutionGateToken }>();
const MAX_CONCURRENT = 50; // Backpressure limit

/**
 * The Heart of Anti-Gravity Autonomy.
 * Polls for valid gates and executes.
 */
export class AutonomousScheduler {
    private isPolling = false;

    startPolling(intervalMs: number = 5000) {
        if (this.isPolling) return;
        this.isPolling = true;
        console.log("🦾 [SCHEDULER] Autonomous Loop Started");

        setInterval(() => this.tick(), intervalMs);
    }

    stopPolling() {
        this.isPolling = false;
        console.log("🛑 [SCHEDULER] Autonomous Loop Stopped");
    }

    // The "Tick" - Check for work
    async tick() {
        // In a real system, this would query a queue or DB for "Pending Gates"
        // For this prototype, we expose a public method to "announce" a gate availability
        // or we assume some global state check.
        // Let's implement 'trySchedule' which would be called by the Gate Service or Bridge
        // automatically when a gate is issued.
    }

    /**
     * Called automatically when a Gate is present.
     * STRICTLY ENFORCES rules before execution.
     */
    async trySchedule(token: ExecutionGateToken) {
        const { ingestId } = token.context;

        // 1. Duplicate Check
        if (RUNNING_PROCESSES.has(ingestId)) {
            console.log(`⚠️ [SCHEDULER] Job ${ingestId} already running. Skipping.`);
            return;
        }

        // 2. Gate Verification (Double Check)
        if (!verifyExecutionGate(token)) {
            console.error(`⛔ [SCHEDULER] Critical: Automatic execution blocked. Invalid Gate for ${ingestId}.`);
            return;
        }

        // 3. Backpressure Check
        if (RUNNING_PROCESSES.size >= MAX_CONCURRENT) {
            console.warn(`🛑 [SCHEDULER] Backpressure Active: Dropping job for ${ingestId}`);
            return;
        }

        // 4. Auto-Start
        this.execute(ingestId, token);
    }

    private execute(ingestId: string, token: ExecutionGateToken) {
        console.log(`🚀 [ANTI-GRAVITY] AUTO-LAUNCHING JOB for ${ingestId}`);
        console.log(`   > Authority: ${token.decision.signature}`);
        console.log(`   > Scope: ${token.decision.scope?.join(', ')}`);

        const jitter = Math.floor(Math.random() * 500); // 0-500ms jitter
        console.log(`⏳ [SCHEDULER] Jitter wait: ${jitter}ms`);

        setTimeout(() => {
            RUNNING_PROCESSES.set(ingestId, { startTime: Date.now(), token });
            // Simulate Execution lifecycle
            setTimeout(() => {
                this.complete(ingestId);
            }, 2000);
        }, jitter);
    }

    private complete(ingestId: string) {
        console.log(`✅ [ANTI-GRAVITY] JOB COMPLETE for ${ingestId}`);
        RUNNING_PROCESSES.delete(ingestId);
    }
}

export const Scheduler = new AutonomousScheduler();
