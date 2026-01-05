import React, { useEffect, useMemo } from 'react';
import { usePlannerContext } from './PlannerContext';
import type { PlannerAdapter, PlannerMode } from './PlannerTypes';
import { NotebookPlanner } from './modes/NotebookPlanner';
import { FormationPlanner } from './modes/FormationPlanner';
import { WorkflowPlanner } from './modes/WorkflowPlanner';

const modeComponents: Record<PlannerMode, React.ReactElement> = {
  notebook: <NotebookPlanner />,
  formation: <FormationPlanner />,
  workflow: <WorkflowPlanner />
};

export function PlannerPanel() {
  const {
    activeTab,
    plannerMode,
    setPlannerMode,
    adapters,
    planningState,
    setPlanningState,
    notebookEnabled,
    setNotebookEnabled
  } = usePlannerContext();

  const adapter = useMemo(
    () => adapters.find(current => current.id === plannerMode),
    [adapters, plannerMode]
  );

  useEffect(() => {
    if (!adapter) return;
    adapter.onActivate({
      activeTab,
      plannerMode,
      planningState,
      notebookEnabled
    });
    return () => {
      adapter.onDeactivate();
    };
  }, [adapter, activeTab, plannerMode, planningState, notebookEnabled]);

  useEffect(() => {
    if (!adapter) return;
    adapter.onContextChange(activeTab);
  }, [adapter, activeTab]);

  return (
    <section className="planner-panel">
      <header className="planner-header">
        <div>
          <h2>Planner Mode</h2>
          <p className="planner-subtitle">
            Phase: Planning
            <br />
            Role: Manager (Human)
            <br />
            Agency: Thinking Only
            <br />
            Execution: Not Available
            <br />
            Metaphor: Tactics Board
            <br />
            This view is for planning and reasoning only. No actions are performed from this surface.
          </p>
        </div>
        <div className="planner-controls">
          <label htmlFor="planner-mode">Planner Mode</label>
          <select
            id="planner-mode"
            value={plannerMode}
            onChange={event => setPlannerMode(event.target.value as PlannerMode)}
          >
            {adapters.map(current => (
              <option key={current.id} value={current.id}>
                {current.label}
              </option>
            ))}
          </select>
          <label className="toggle">
            <input
              type="checkbox"
              checked={notebookEnabled}
              onChange={event => setNotebookEnabled(event.target.checked)}
            />
            Notebook LLM enabled
          </label>
        </div>
      </header>

      <div className="planner-mode-view">{modeComponents[plannerMode]}</div>

      <section className="planner-notes">
        <h3>Planning Notes</h3>
        <textarea
          value={planningState.notes}
          onChange={event => setPlanningState({ ...planningState, notes: event.target.value })}
          placeholder="Capture decisions, rationale, and next steps. Notes are local and read-only to execution."
          rows={6}
        />
      </section>
    </section>
  );
}
