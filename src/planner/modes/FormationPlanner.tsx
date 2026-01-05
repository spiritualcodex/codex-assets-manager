import React from 'react';

export function FormationPlanner() {
  return (
    <div className="planner-mode">
      <h3>Formation Planner</h3>
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
      <div className="formation-grid">
        <div className="formation-node">Manager</div>
        <div className="formation-node">Analyst</div>
        <div className="formation-node">Captain A</div>
        <div className="formation-node">Captain B</div>
        <div className="formation-node">Observer</div>
      </div>
      <p className="planner-note">
        Formation layouts are placeholders. No assignments or execution hooks are created here.
      </p>
    </div>
  );
}
