import React, { createContext, useContext, useMemo, useState } from 'react';
import type { NotebookMessage, PanelTab, PlannerAdapter, PlannerMode, PlanningState } from './PlannerTypes';

type PlannerContextValue = {
  activeTab: PanelTab;
  setActiveTab: (tab: PanelTab) => void;
  plannerMode: PlannerMode;
  setPlannerMode: (mode: PlannerMode) => void;
  planningState: PlanningState;
  setPlanningState: (state: PlanningState) => void;
  messages: NotebookMessage[];
  setMessages: (messages: NotebookMessage[]) => void;
  notebookEnabled: boolean;
  setNotebookEnabled: (enabled: boolean) => void;
  adapters: PlannerAdapter[];
};

const PlannerContext = createContext<PlannerContextValue | null>(null);

const defaultPlanningState: PlanningState = {
  notes: '',
  plans: [],
  mappings: []
};

export function PlannerProvider({ children }: { children?: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<PanelTab>('planner');
  const [plannerMode, setPlannerMode] = useState<PlannerMode>('notebook');
  const [planningState, setPlanningState] = useState<PlanningState>(defaultPlanningState);
  const [messages, setMessages] = useState<NotebookMessage[]>([]);
  const [notebookEnabled, setNotebookEnabled] = useState(true);

  const adapters = useMemo<PlannerAdapter[]>(() => {
    const readPlanningState = () => planningState;
    const writePlanningNotes = (notes: string) => {
      setPlanningState({ ...planningState, notes });
    };

    const baseAdapter = {
      onActivate: () => {},
      onDeactivate: () => {},
      onContextChange: () => {},
      readPlanningState,
      writePlanningNotes
    };

    return [
      { ...baseAdapter, id: 'notebook', label: 'Notebook' },
      { ...baseAdapter, id: 'formation', label: 'Formation' },
      { ...baseAdapter, id: 'workflow', label: 'Workflow' }
    ];
  }, [planningState]);

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      plannerMode,
      setPlannerMode,
      planningState,
      setPlanningState,
      messages,
      setMessages,
      notebookEnabled,
      setNotebookEnabled,
      adapters
    }),
    [activeTab, plannerMode, planningState, messages, notebookEnabled, adapters]
  );

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlannerContext() {
  const ctx = useContext(PlannerContext);
  if (!ctx) {
    throw new Error('PlannerContext missing. Wrap in PlannerProvider.');
  }
  return ctx;
}
