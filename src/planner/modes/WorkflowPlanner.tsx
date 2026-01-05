import React from 'react';

export function WorkflowPlanner() {
  return (
    <div className="planner-mode">
      <h3>Workflow Planner</h3>
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
      <div className="workflow-canvas">
        <div className="workflow-node">Idea</div>
        <div className="workflow-node">Review</div>
        <div className="workflow-node">Decision</div>
        <div className="workflow-node">Checklist</div>
      </div>
      <p className="planner-note">
        Workflow nodes are static placeholders. No automation or triggers are permitted.
      </p>
    </div>
  );
}
