export enum ToolStatus {
  Active = 'Active',
  Legacy = 'Legacy',
  Optional = 'Optional',
  Locked = 'Locked',
  Experimental = 'Experimental',
  Archived = 'Archived',
  Deprecated = 'Deprecated'
}

export type AutonomousLevel = 'manual' | 'semi' | 'full';
export type ToolExecutionMode = 'Local' | 'Remote' | 'Cloud' | 'Autonomous' | 'Automated deploy' | 'Managed cloud';

export interface Tool {
  id: string;
  category: string;
  name: string;
  role: string;
  status: ToolStatus;
  executionMode: ToolExecutionMode;
  connectedSystems: string;
  capabilities: string[];
  autonomousLevel: AutonomousLevel;
}

export interface MissionStep {
  step: string;
  description: string;
  toolsUsed: string[];
}

export interface MissionRecommendation {
  missionAnalysis: string;
  executionPlan: MissionStep[];
  recommendedTools: {
    toolId: string;
    why: string;
  }[];
  autonomousConfidence: number;
}