export type ToolStatus = "idle" | "running" | "completed" | "error";

export interface Tool {
  id: string;
  name: string;
  description: string;
  status: ToolStatus;
}

export interface MissionRecommendation {
  title: string;
  description: string;
  recommendedTools: string[];
}
