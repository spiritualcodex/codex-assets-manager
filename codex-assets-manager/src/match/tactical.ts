// codex-assets-manager/src/match/tactical.ts

import { MatchState, buildMatchState } from './bridge';
import { DelegationService, Role } from '../delegation/delegation.roles';

export interface BindIntent {
    agentId: string; // or 'operator-id'
    ingestId: string;
    timestamp: number;
    status: 'PENDING_VAULT_APPROVAL';
    role?: Role;
}

export interface TacticalContext {
    matchState: MatchState;       // Read-only view of the field
    agentId: string;
    role: 'OBSERVER' | 'TACTICIAN';
    timestamp: string;
}

/**
 * Tactical Agent Consumption Interface.
 * 
 * Agents call this to "see" the field.
 * Agents CANNOT change the field.
 */
export async function perceiveMatchState(agentId: string, ingestId: string): Promise<TacticalContext> {
    const matchState = await buildMatchState(ingestId);

    // Tactical Decision Gating
    // Agents can only perceive if the match is READY or STOPPED (to know why).

    return {
        matchState,
        agentId,
        role: 'TACTICIAN',
        timestamp: new Date().toISOString()
    };
}

/**
 * Tactical Request for Binding.
 * Generates a signal for the Vault to review.
 * Phase 12: Delegation Support.
 */
export async function requestBind(agentId: string, ingestId: string, role: Role = Role.VIEWER): Promise<BindIntent> {
    console.log(`🤖 [TACTICAL] Agent/Operator ${agentId} (${role}) REQUESTING BIND for ${ingestId}`);

    // Phase 12: Delegation Check
    if (role === Role.OPERATOR && !DelegationService.checkPermission(role, 'request:intent')) {
        throw new Error("UNAUTHORIZED_DELEGATION");
    }

    return {
        agentId,
        ingestId,
        timestamp: Date.now(),
        status: 'PENDING_VAULT_APPROVAL',
        role
    };
}

/**
 * Example of an Agent evaluation loop (Read-Only).
 * This function evaluates the state but produces no side effects on the system.
 */
export function evaluateTactics(context: TacticalContext) {
    if (context.matchState.status !== 'READY') {
        return { decision: 'HOLD', reason: 'Match not ready' };
    }

    // Tactical logic would go here
    if (context.matchState.squad.providers.includes('Oracle')) {
        return { decision: 'ENGAGE', strategy: 'Oracle-Lead' };
    }

    return { decision: 'WAIT', reason: 'No clear strategy' };
}
