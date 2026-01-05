import React from "react";
import { Tool } from "../types";

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  return (
    <div className="tool-card">
      <h3>{tool.name}</h3>
      <p>{tool.description}</p>
      <span>Status: {tool.status}</span>
    </div>
  );
};

export default ToolCard;
