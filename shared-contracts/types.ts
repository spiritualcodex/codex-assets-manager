// shared-contracts/types.ts

export interface Asset {
    id: string;
    name: string;
    type: 'contract' | 'token' | 'agent' | 'module';
    status: 'active' | 'archived' | 'draft';
    meta: Record<string, unknown>;
}

export interface Tool {
    id: string;
    name: string;
    description: string;
    category: 'analysis' | 'deployment' | 'security';
    isAvailable: boolean;
}

export interface MatchState {
    matchId: string;
    homeScore: number;
    awayScore: number;
    timeRemaining: number; // seconds
    isPaused: boolean;
    events: Array<{
        timestamp: number;
        type: string;
        description: string;
    }>;
}

export type NavigationTab = 'office' | 'game' | 'assets' | 'decoder';

export interface NavigationState {
    activeTab: NavigationTab;
    gameBackground: boolean; // if true, game runs in background
}
