// codex-assets-manager/src/economics/cost-governor.service.ts

export interface Budget {
    projectId: string;
    limitUsd: number;
    currentSpendUsd: number;
    currency: 'USD';
    resetPeriod: 'MONTHLY';
}

const BUDGETS = new Map<string, Budget>();

// Seed default budget
BUDGETS.set('default', {
    projectId: 'default',
    limitUsd: 100.00,
    currentSpendUsd: 45.50,
    currency: 'USD',
    resetPeriod: 'MONTHLY'
});

export const CostGovernor = {
    /**
     * Hard Governor Check.
     * Must return TRUE to allow execution.
     */
    checkBudget(projectId: string = 'default', estimatedCostUsd: number = 0.01): boolean {
        const budget = BUDGETS.get(projectId);

        if (!budget) {
            console.warn(`💰 [GOVERNOR] No budget found for ${projectId}. Defaulting to DENY.`);
            return false; // Fail Closed
        }

        if (budget.currentSpendUsd + estimatedCostUsd > budget.limitUsd) {
            console.error(`💰 [GOVERNOR] BUDGET EXCEEDED: ${projectId}. Limit: $${budget.limitUsd}, Projected: $${budget.currentSpendUsd + estimatedCostUsd}`);
            return false;
        }

        // Phase 10: Pre-Gate Simulation Check
        const projectedBurn = this.predictBurn(projectId, 5); // 5 min job
        if (budget.currentSpendUsd + projectedBurn > budget.limitUsd) {
            console.warn(`💰 [GOVERNOR] PREDICTIVE STOP: Job likely to exceed budget.`);
            return false;
        }

        return true;
    },

    /**
     * Phase 10: Predictive Burn
     */
    predictBurn(projectId: string, durationMinutes: number): number {
        // Mock linear extrapolation
        const avgCostPerMin = 0.05;
        return avgCostPerMin * durationMinutes;
    },

    /**
     * Commit Spend.
     */
    charge(projectId: string = 'default', amountUsd: number) {
        const budget = BUDGETS.get(projectId);
        if (budget) {
            budget.currentSpendUsd += amountUsd;
            console.log(`💸 [GOVERNOR] Charged $${amountUsd}. New Spend: $${budget.currentSpendUsd}`);
        }
    }
};
