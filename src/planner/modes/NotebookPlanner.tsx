import React from 'react';

export function NotebookPlanner() {
  return (
    <div className="planner-mode">
      <h3>Notebook Planner</h3>
      <p>
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
      <ul>
        <li>Capture assumptions and open questions.</li>
        <li>Summarize decisions for later review.</li>
        <li>Draft checklists without activating workflows.</li>
      </ul>
    </div>
  );
}
