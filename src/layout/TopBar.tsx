// TopBar.tsx
// Displays the top navigation bar for the control plane. Contains no business logic or local authority.

import React from 'react';
import { usePlannerContext } from '../planner/PlannerContext';

export function TopBar() {
  const { activeTab, plannerMode } = usePlannerContext();

  return (
    <header className="topbar">
      <div className="topbar-title">
        <strong>Office Control Panel</strong>
        <span>
          System Phase: Office Control
          <br />
          Mode: Planning & Observation
          <br />
          Execution: Disabled by Default
          <br />
          This panel does not modify system state.
        </span>
      </div>
      <div className="topbar-status">
        <span>Tab: {activeTab}</span>
        <span>Planner: {plannerMode}</span>
      </div>
    </header>
  );
}
