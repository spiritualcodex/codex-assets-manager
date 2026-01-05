// Sidebar.tsx
// Presents navigation links to major views. Decisions about visibility are deferred to the Vault.

import React from 'react';
import { usePlannerContext } from '../planner/PlannerContext';
import type { PanelTab } from '../planner/PlannerTypes';

const tabs: PanelTab[] = ['planner', 'assets', 'ingest', 'vault', 'activity', 'system'];

export function Sidebar() {
  const { activeTab, setActiveTab } = usePlannerContext();

  return (
    <aside className="sidebar">
      <h2>Office Panel</h2>
      <nav>
        {tabs.map(tab => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
    </aside>
  );
}
