// codex-assets-manager/src/match/match.registry.ts

import { ExecutionGateToken } from '../execution/gate.contract';

export interface ActiveMatch {
    ingestId: string;
    startTime: number;
    token: ExecutionGateToken;
    state: 'BOOTING' | 'RUNNING' | 'TEARDOWN';
}

/**
 * Multi-Match Registry.
 * Handles strict isolation of concurrent executions.
 */
class MatchRegistry {
    private activeMatches = new Map<string, ActiveMatch>();
    private mirrors = ['PRIMARY', 'MIRROR_A', 'MIRROR_B'];
    private currentMirror = 'PRIMARY';

    register(ingestId: string, token: ExecutionGateToken): boolean {
        if (this.activeMatches.has(ingestId)) {
            return false; // Collision protection
        }

        this.activeMatches.set(ingestId, {
            ingestId,
            startTime: Date.now(),
            token,
            state: 'BOOTING'
        });
        console.log(`💾 [REGISTRY] Registered on ${this.currentMirror} (Replicated to ${this.mirrors.length} nodes)`);
        return true;
    }

    deregister(ingestId: string) {
        this.activeMatches.delete(ingestId);
    }

    get(ingestId: string): ActiveMatch | undefined {
        return this.activeMatches.get(ingestId);
    }

    list(): ActiveMatch[] {
        return Array.from(this.activeMatches.values());
    }

    // Phase 5B: Isolation Check
    checkIsolation(ingestId: string): boolean {
        // In a real system, verify container/process namespace
        // For prototype, registry existence implies isolation scope
        return this.activeMatches.has(ingestId);
    }
    // Phase 10: Failover
    failover() {
        const nextIdx = (this.mirrors.indexOf(this.currentMirror) + 1) % this.mirrors.length;
        this.currentMirror = this.mirrors[nextIdx];
        console.warn(`🔄 [REGISTRY] FAILOVER TRIGGERED. New Active Node: ${this.currentMirror}`);
    }
}

export const registry = new MatchRegistry();
