
import { Tool, ToolStatus } from './types.ts';

export const INITIAL_TOOLS: Tool[] = [
  // Terminal / Runtime
  // Fix: changed 'Local + Cloud' to 'Local' to match ToolExecutionMode type
  { id: 'nodejs', category: 'Terminal / Runtime', name: 'Node.js', role: 'Core runtime for engines, backends, agents', status: ToolStatus.Active, executionMode: 'Local', connectedSystems: 'All Node-based repos', capabilities: ['runtime', 'js', 'ts'], autonomousLevel: 'full' },
  // Fix: changed 'Local + CI' to 'Local' to match ToolExecutionMode type
  { id: 'npm', category: 'Terminal / Runtime', name: 'npm', role: 'Dependency & script runner', status: ToolStatus.Active, executionMode: 'Local', connectedSystems: 'All JS/TS repos', capabilities: ['package-management'], autonomousLevel: 'semi' },
  { id: 'powershell', category: 'Terminal / Runtime', name: 'PowerShell', role: 'Command execution (Windows)', status: ToolStatus.Active, executionMode: 'Local', connectedSystems: 'Dev machines', capabilities: ['os-automation'], autonomousLevel: 'manual' },
  // Fix: changed 'Local + CI' to 'Local' to match ToolExecutionMode type
  { id: 'bash', category: 'Terminal / Runtime', name: 'Bash', role: 'Cross-platform scripting', status: ToolStatus.Active, executionMode: 'Local', connectedSystems: 'Select repos', capabilities: ['scripting'], autonomousLevel: 'full' },
  
  // Version Control
  // Fix: changed 'Local + Remote' to 'Local' to match ToolExecutionMode type
  { id: 'git', category: 'Version Control', name: 'Git', role: 'Source control', status: ToolStatus.Active, executionMode: 'Local', connectedSystems: 'All repos', capabilities: ['vcs'], autonomousLevel: 'full' },
  { id: 'github', category: 'Version Control', name: 'GitHub', role: 'Canonical source of truth', status: ToolStatus.Active, executionMode: 'Remote', connectedSystems: 'All repos', capabilities: ['collaboration', 'ci-cd'], autonomousLevel: 'semi' },
  
  // Autonomous Builders
  { id: 'codex-builder', category: 'Autonomous Builders', name: 'Codex Builder', role: 'Primary autonomous code builder', status: ToolStatus.Active, executionMode: 'Autonomous', connectedSystems: 'Multiple repos', capabilities: ['code-gen'], autonomousLevel: 'full' },
  // Fix: changed 'Semi-autonomous' to 'Autonomous' to match ToolExecutionMode type
  { id: 'gemini-studio', category: 'Autonomous Builders', name: 'Gemini / Google AI Studio', role: 'UI builder, logic prototyper', status: ToolStatus.Active, executionMode: 'Autonomous', connectedSystems: 'Frontend repos', capabilities: ['ai-logic', 'prototyping'], autonomousLevel: 'semi' },
  { id: 'autopilot', category: 'Autonomous Builders', name: 'Autopilot / Anti-Gravity', role: 'Task execution & orchestration', status: ToolStatus.Active, executionMode: 'Autonomous', connectedSystems: 'Backend / engine repos', capabilities: ['task-orchestration'], autonomousLevel: 'full' },
  { id: 'orchestrator-core', category: 'Autonomous Builders', name: 'Agent Orchestrator Core', role: 'Runs agents & long tasks', status: ToolStatus.Active, executionMode: 'Autonomous', connectedSystems: 'agent-orchestrator-core', capabilities: ['multi-agent'], autonomousLevel: 'full' },
  
  // Cloud / Hosting
  { id: 'render', category: 'Cloud / Hosting', name: 'Render', role: 'Backend & engine hosting', status: ToolStatus.Active, executionMode: 'Automated deploy', connectedSystems: 'Backends / engines', capabilities: ['hosting'], autonomousLevel: 'semi' },
  { id: 'netlify', category: 'Cloud / Hosting', name: 'Netlify', role: 'Frontend hosting', status: ToolStatus.Active, executionMode: 'Automated deploy', connectedSystems: 'Frontend UIs', capabilities: ['hosting'], autonomousLevel: 'semi' },
  
  // Databases / Auth
  { id: 'supabase', category: 'Databases / Auth', name: 'Supabase', role: 'Auth, DB, storage', status: ToolStatus.Active, executionMode: 'Managed cloud', connectedSystems: 'Office, apps', capabilities: ['backend-as-a-service'], autonomousLevel: 'semi' },
  
  // UI / Frontend
  { id: 'react', category: 'UI / Frontend', name: 'React', role: 'Primary UI framework', status: ToolStatus.Active, executionMode: 'Autonomous', connectedSystems: 'Frontend repos', capabilities: ['ui-framework'], autonomousLevel: 'full' },
  { id: 'tailwind', category: 'UI / Frontend', name: 'Tailwind CSS', role: 'Styling system', status: ToolStatus.Active, executionMode: 'Autonomous', connectedSystems: 'Frontend repos', capabilities: ['styling'], autonomousLevel: 'full' },
  { id: 'vite', category: 'UI / Frontend', name: 'Vite', role: 'Frontend bundler', status: ToolStatus.Active, executionMode: 'Autonomous', connectedSystems: 'Frontend repos', capabilities: ['bundling'], autonomousLevel: 'full' },
  
  // AI / Intelligence
  // Fix: changed 'API / Builder' to 'Cloud' to match ToolExecutionMode type
  { id: 'gemini-models', category: 'AI / Intelligence', name: 'Gemini Models', role: 'Reasoning, text, UI logic', status: ToolStatus.Active, executionMode: 'Cloud', connectedSystems: 'Frontends', capabilities: ['reasoning', 'multimodal'], autonomousLevel: 'full' },
  // Fix: changed 'API / Agents' to 'Cloud' to match ToolExecutionMode type
  { id: 'gpt-openai', category: 'AI / Intelligence', name: 'GPT (OpenAI)', role: 'Reasoning, agents, planning', status: ToolStatus.Active, executionMode: 'Cloud', connectedSystems: 'Multiple systems', capabilities: ['planning'], autonomousLevel: 'full' },
  
  // Automation / Integration
  { id: 'zapier', category: 'Automation / Integration', name: 'Zapier', role: 'External automation', status: ToolStatus.Active, executionMode: 'Cloud', connectedSystems: 'Selected workflows', capabilities: ['integration'], autonomousLevel: 'semi' },
  
  // Media / Assets
  // Fix: changed 'CLI / Cloud' to 'Cloud' to match ToolExecutionMode type
  { id: 'canva-cli', category: 'Media / Assets', name: 'Canva CLI', role: 'Asset generation', status: ToolStatus.Active, executionMode: 'Cloud', connectedSystems: 'Assets manager', capabilities: ['graphics'], autonomousLevel: 'semi' },
  // Fix: changed 'API' to 'Cloud' to match ToolExecutionMode type
  { id: 'eleven-labs', category: 'Media / Assets', name: 'ElevenLabs', role: 'Voice / TTS', status: ToolStatus.Optional, executionMode: 'Cloud', connectedSystems: 'Media pipelines', capabilities: ['audio'], autonomousLevel: 'semi' },
  
  // Game / Simulation
  // Fix: changed 'Backend service' to 'Remote' to match ToolExecutionMode type
  { id: 'tactical-engine', category: 'Game / Simulation', name: 'Tactical Simulation Engine', role: 'Football logic & stats', status: ToolStatus.Active, executionMode: 'Remote', connectedSystems: 'tactical-simulation-engine', capabilities: ['logic-engine'], autonomousLevel: 'full' }
];

export const MISSION_PRESETS = [
  { label: "Full-Stack Feature Deployment", value: "Develop a new user dashboard in React, set up a Supabase table for data, and deploy the frontend to Netlify while hosting the API on Render." },
  { label: "Content Syndication Pipeline", value: "Write a technical article using Gemini, post it to WordPress, and syndicate it automatically to Medium and Quora." },
  { label: "Engine Performance Audit", value: "Run diagnostic tests on the Tactical Simulation Engine, analyze logs with GPT, and push fixed code to GitHub." }
];
