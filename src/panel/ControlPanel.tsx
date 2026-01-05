import React from 'react';
import { PlannerProvider } from '../planner/PlannerContext';
import { PlannerPanel } from '../planner/PlannerPanel';
import { NotebookChat } from '../planner/NotebookChat';
import { TopBar } from '../layout/TopBar';
import { Sidebar } from '../layout/Sidebar';
import { MainPanel } from '../layout/MainPanel';
import { usePlannerContext } from '../planner/PlannerContext';
import './ControlPanel.css';

function TabContent() {
  const { activeTab } = usePlannerContext();

  if (activeTab === 'planner') {
    return <PlannerPanel />;
  }

  return (
    <section className="tab-placeholder">
      <h2>{activeTab.toUpperCase()} (Read-Only Placeholder)</h2>
      <p>This panel is intentionally non-executing. Planning context persists globally.</p>
    </section>
  );
}

export function ControlPanel() {
  return (
    <PlannerProvider>
      <div className="control-panel">
        <TopBar />
        <div className="control-body">
          <Sidebar />
          <MainPanel>
            <TabContent />
          </MainPanel>
          <NotebookChat />
        </div>
      </div>
    </PlannerProvider>
  );
}
