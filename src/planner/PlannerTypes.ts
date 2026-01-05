export type PlannerMode = 'notebook' | 'formation' | 'workflow';
export type PanelTab = 'planner' | 'assets' | 'ingest' | 'vault' | 'activity' | 'system';

export type NotebookRole = 'user' | 'notebook';

export type NotebookMessage = {
  id: string;
  role: NotebookRole;
  content: string;
  timestamp: string;
};

export type PlanningState = {
  notes: string;
  plans: string[];
  mappings: string[];
};

export type PlannerAdapter = {
  id: PlannerMode;
  label: string;
  onActivate: (panelState: PanelStateSnapshot) => void;
  onDeactivate: () => void;
  onContextChange: (activeTab: PanelTab) => void;
  readPlanningState: () => PlanningState;
  writePlanningNotes: (notes: string) => void;
};

export type PanelStateSnapshot = {
  activeTab: PanelTab;
  plannerMode: PlannerMode;
  planningState: PlanningState;
  notebookEnabled: boolean;
};
