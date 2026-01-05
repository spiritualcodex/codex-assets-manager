import { Tool, ToolStatus } from './types.ts';

export const INITIAL_TOOLS: Tool[] = [
  // TERMINAL / RUNTIME
  { 
    id: 'nodejs', category: 'Terminal / Runtime', name: 'Node.js', 
    role: 'Core runtime for engines, backends, agents', 
    why: 'Primary execution environment for all sovereign services.',
    connected: 'All Node Repos', status: ToolStatus.Active, lifecycle: 'active',
    runsIn: 'local', requiresHumanApproval: false, canRunUnattended: true,
    primaryCapability: 'runtime', capabilities: ['runtime', 'scripting'],
    permissions: ['execute'], autonomousLevel: 'full', trustLevel: 5,
    isExperimental: false, isProductionSafe: true, guardrails: ['Resource limits'], lastVerified: '2025-05-25'
  },
  { 
    id: 'npm', category: 'Terminal / Runtime', name: 'npm', 
    role: 'Dependency & script runner', 
    why: 'Managing the ecosystem and package lifecycle.',
    connected: 'All JS/TS Repos', status: ToolStatus.Active, lifecycle: 'active',
    runsIn: 'local', requiresHumanApproval: true, canRunUnattended: true,
    primaryCapability: 'package-mgmt', capabilities: ['package-mgmt', 'scripts'],
    permissions: ['write', 'execute'], autonomousLevel: 'semi', trustLevel: 5,
    isExperimental: false, isProductionSafe: true, guardrails: ['Audit required'], lastVerified: '2025-05-25'
  },
  { 
    id: 'powershell', category: 'Terminal / Runtime', name: 'PowerShell', 
    role: 'Command execution (Windows)', 
    why: 'Deep OS-level integration and automation scripting.',
    connected: 'Dev Machines', status: ToolStatus.Active, lifecycle: 'active',
    runsIn: 'local', requiresHumanApproval: true, canRunUnattended: true,
    primaryCapability: 'automation', capabilities: ['automation', 'sys-admin'],
    permissions: ['execute'], autonomousLevel: 'manual', trustLevel: 4,
    isExperimental: false, isProductionSafe: true, guardrails: ['Admin privs'], lastVerified: '2025-05-25'
  },
  { 
    id: 'bash', category: 'Terminal / Runtime', name: 'Bash', 
    role: 'Cross-platform scripting', 
    why: 'Portable shell scripting for CI/CD and local environments.',
    connected: 'Select Repos', status: ToolStatus.Active, lifecycle: 'active',
    runsIn: 'local', requiresHumanApproval: false, canRunUnattended: true,
    primaryCapability: 'scripting', capabilities: ['scripting', 'terminal'],
    permissions: ['execute'], autonomousLevel: 'full', trustLevel: 5,
    isExperimental: false, isProductionSafe: true, guardrails: ['POSIX compliance'], lastVerified: '2025-05-25'
  },
  // VERSION CONTROL
  { 
    id: 'git', category: 'Version Control', name: 'Git', 
    role: 'Source control', 
    why: 'Distributed version tracking for all code assets.',
    connected: 'All Repos', status: ToolStatus.Active, lifecycle: 'active',
    runsIn: 'local', requiresHumanApproval: false, canRunUnattended: true,
    primaryCapability: 'vcs', capabilities: ['vcs', 'history'],
    permissions: ['write', 'read'], autonomousLevel: 'full', trustLevel: 5,
    isExperimental: false, isProductionSafe: true, guardrails: ['SSH Auth'], lastVerified: '2025-05-25'
  },
  { 
    id: 'github', category: 'Version Control', name: 'GitHub', 
    role: 'Canonical source of truth', 
    why: 'Centralized repository hosting and CI/CD pipelines.',
    connected: 'All Repos', status: ToolStatus.Active, lifecycle: 'active',
    runsIn: 'cloud', requiresHumanApproval: true, canRunUnattended: true,
    primaryCapability: 'hosting', capabilities: ['hosting', 'collaboration', 'actions'],
    permissions: ['write', 'read'], autonomousLevel: 'semi', trustLevel: 5,
    isExperimental: false, isProductionSafe: true, guardrails: ['PAT required'], lastVerified: '2025-05-25'
  },
  // AUTONOMOUS BUILDERS
  { 
    id: 'codex-builder', category: 'Autonomous Builders', name: 'Codex Builder', 
    role: 'Primary autonomous code builder', 
    why: 'Generates and updates logic across the entire codex.',
    connected: 'Multiple Repos', status: ToolStatus.Active, lifecycle: 'active',
    runsIn: 'builder-only', requiresHumanApproval: true, canRunUnattended: true,
    primaryCapability: 'code-gen', capabilities: ['code-gen', 'orchestration'],
    permissions: ['write', 'execute'], autonomousLevel: 'full', trustLevel: 5,
    isExperimental: false, isProductionSafe: true, guardrails: ['Human review'], lastVerified: '2025-05-25'
  },
  { 
    id: 'autopilot', category: 'Autonomous Builders', name: 'Autopilot / Anti-Gravity', 
    role: 'Task execution & orchestration', 
    why: 'Autonomous navigation of complex engineering tasks.',
    connected: 'Backend Repos', status: ToolStatus.Active, lifecycle: 'active',
    runsIn: 'agent-only', requiresHumanApproval: false, canRunUnattended: true,
    primaryCapability: 'orchestration', capabilities: ['orchestration', 'automation'],
    permissions: ['execute'], autonomousLevel: 'full', trustLevel: 4,
    isExperimental: true, isProductionSafe: true, guardrails: ['Sandboxed'], lastVerified: '2025-05-25'
  },
  { 
    id: 'agent-orchestrator', category: 'Autonomous Builders', name: 'Agent Orchestrator Core', 
    role: 'Runs agents & long tasks', 
    why: 'Control plane for long-running autonomous agent missions.',
    connected: 'agent-orchestrator-core', status: ToolStatus.Active, lifecycle: 'active',
    runsIn: 'agent-only', requiresHumanApproval: true, canRunUnattended: true,
    primaryCapability: 'orchestration', capabilities: ['orchestration', 'sys-admin'],
    permissions: ['execute', 'write'], autonomousLevel: 'full', trustLevel: 5,
    isExperimental: false, isProductionSafe: true, guardrails: ['Killswitch active'], lastVerified: '2025-05-25'
  },
  // CLOUD / HOSTING
  { 
    id: 'render', category: 'Cloud / Hosting', name: 'Render', 
    role: 'Backend hosting', 
    why: 'Reliable deployment of server-side services.',
    connected: 'Backends', status: ToolStatus.Active, lifecycle: 'active',
    runsIn: 'cloud', requiresHumanApproval: true, canRunUnattended: true,
    primaryCapability: 'hosting', capabilities: ['hosting', 'paas'],
    permissions: ['write', 'execute'], autonomousLevel: 'semi', trustLevel: 5,
    isExperimental: false, isProductionSafe: true, guardrails: ['Webhook auth'], lastVerified: '2025-05-25'
  },
  { 
    id: 'netlify', category: 'Cloud / Hosting', name: 'Netlify', 
    role: 'Frontend hosting', 
    why: 'Static site deployment and edge functions.',
    connected: 'Frontend UIs', status: ToolStatus.Active, lifecycle: 'active',
    runsIn: 'cloud', requiresHumanApproval: false, canRunUnattended: true,
    primaryCapability: 'static-hosting', capabilities: ['static-hosting', 'edge-functions'],
    permissions: ['write'], autonomousLevel: 'full', trustLevel: 5,
    isExperimental: false, isProductionSafe: true, guardrails: ['CI link'], lastVerified: '2025-05-25'
  },
  { 
    id: 'vercel', category: 'Cloud / Hosting', name: 'Vercel', 
    role: 'Edge hosting', 
    why: 'High-performance frontend and serverless hosting.',
    connected: 'Select UIs', status: ToolStatus.Optional, lifecycle: 'active',
    runsIn: 'cloud', requiresHumanApproval: false, canRunUnattended: true,
    primaryCapability: 'static-hosting', capabilities: ['static-hosting', 'edge'],
    permissions: ['write'], autonomousLevel: 'semi', trustLevel: 4,
    isExperimental: false, isProductionSafe: true, guardrails: ['API Key'], lastVerified: '2025-05-25'
  },
  // DATABASES / AUTH
  { 
    id: 'supabase', category: 'Databases / Auth', name: 'Supabase', 
    role: 'PostgreSQL & Auth', 
    why: 'The backbone for data persistence and user security.',
    connected: 'All Apps', status: ToolStatus.Active, lifecycle: 'active',
    runsIn: 'cloud', requiresHumanApproval: true, canRunUnattended: true,
    primaryCapability: 'database', capabilities: ['database', 'auth', 'storage'],
    permissions: ['read', 'write'], autonomousLevel: 'semi', trustLevel: 5,
    isExperimental: false, isProductionSafe: true, guardrails: ['RLS active'], lastVerified: '2025-05-25'
  },
  { 
    id: 'postgresql', category: 'Databases / Auth', name: 'PostgreSQL', 
    role: 'Relational data', 
    why: 'Core relational database engine for complex schemas.',
    connected: 'Office, Engines', status: ToolStatus.Active, lifecycle: 'active',
    runsIn: 'cloud', requiresHumanApproval: true, canRunUnattended: true,
    primaryCapability: 'database', capabilities: ['database', 'logic'],
    permissions: ['read', 'write'], autonomousLevel: 'manual', trustLevel: 5,
    isExperimental: false, isProductionSafe: true, guardrails: ['Backups required'], lastVerified: '2025-05-25'
  },
  // AI / INTELLIGENCE
  { 
    id: 'gemini-models', category: 'AI / Intelligence', name: 'Gemini Models', 
    role: 'Reasoning, text, UI logic', 
    why: 'Primary multimodal reasoning engine.',
    connected: 'Frontends', status: ToolStatus.Active, lifecycle: 'active',
    runsIn: 'cloud', requiresHumanApproval: false, canRunUnattended: true,
    primaryCapability: 'ai-logic', capabilities: ['ai-logic', 'ui-gen'],
    permissions: ['read'], autonomousLevel: 'full', trustLevel: 5,
    isExperimental: false, isProductionSafe: true, guardrails: ['Token caps'], lastVerified: '2025-05-25'
  },
  { 
    id: 'openai', category: 'AI / Intelligence', name: 'GPT-4o (OpenAI)', 
    role: 'Agent reasoning & planning', 
    why: 'High-level planning and reasoning for agents.',
    connected: 'Orchestrator', status: ToolStatus.Active, lifecycle: 'active',
    runsIn: 'cloud', requiresHumanApproval: false, canRunUnattended: true,
    primaryCapability: 'ai-logic', capabilities: ['ai-logic', 'planning'],
    permissions: ['read'], autonomousLevel: 'full', trustLevel: 5,
    isExperimental: false, isProductionSafe: true, guardrails: ['Usage limits'], lastVerified: '2025-05-25'
  },
  // CONTENT
  { 
    id: 'wordpress', category: 'Content / Distribution', name: 'WordPress', 
    role: 'Content distribution', 
    why: 'Main platform for public content hosting.',
    connected: 'codex-bridge', status: ToolStatus.Active, lifecycle: 'active',
    runsIn: 'cloud', requiresHumanApproval: true, canRunUnattended: true,
    primaryCapability: 'cms', capabilities: ['cms', 'distribution'],
    permissions: ['write'], autonomousLevel: 'semi', trustLevel: 4,
    isExperimental: false, isProductionSafe: true, guardrails: ['2FA'], lastVerified: '2025-05-25'
  },
  { 
    id: 'medium', category: 'Content / Distribution', name: 'Medium', 
    role: 'Content syndication', 
    why: 'Reaching broader audiences via professional blogging.',
    connected: 'Content flows', status: ToolStatus.Active, lifecycle: 'active',
    runsIn: 'cloud', requiresHumanApproval: false, canRunUnattended: true,
    primaryCapability: 'distribution', capabilities: ['distribution'],
    permissions: ['write'], autonomousLevel: 'full', trustLevel: 4,
    isExperimental: false, isProductionSafe: true, guardrails: ['Human review'], lastVerified: '2025-05-25'
  },
  // GAME / SIM
  { 
    id: 'tactical-engine', category: 'Game / Simulation', name: 'Tactical Sim Engine', 
    role: 'Football logic core', 
    why: 'Sovereign simulation logic for match processing.',
    connected: 'simulation-engine', status: ToolStatus.Active, lifecycle: 'active',
    runsIn: 'agent-only', requiresHumanApproval: true, canRunUnattended: true,
    primaryCapability: 'simulation', capabilities: ['simulation', 'logic'],
    permissions: ['execute'], autonomousLevel: 'full', trustLevel: 5,
    isExperimental: false, isProductionSafe: true, guardrails: ['Integrity checks'], lastVerified: '2025-05-25'
  },
  // CONTROL PLANE
  { 
    id: 'codex-manager', category: 'Control Plane', name: 'Codex Manager Backend', 
    role: 'Office logic & orchestration', 
    why: 'The brain of the operation, managing all system signals.',
    connected: 'codex-manager-backend', status: ToolStatus.Active, lifecycle: 'active',
    runsIn: 'local', requiresHumanApproval: true, canRunUnattended: true,
    primaryCapability: 'orchestration', capabilities: ['orchestration', 'sys-admin'],
    permissions: ['write', 'execute'], autonomousLevel: 'full', trustLevel: 5,
    isExperimental: false, isProductionSafe: true, guardrails: ['Audit trail'], lastVerified: '2025-05-25'
  }
];

export const MISSION_PRESETS = [
  { label: "New App Sprint", value: "Build a new React-based analytics dashboard and deploy it to Netlify with a Supabase backend." },
  { label: "Season Simulation", value: "Run a full 38-game simulation of the Premier League using the Tactical Sim Engine and report results to WordPress." },
  { label: "Asset Pipeline", value: "Generate 50 product images using Canva CLI and 10 voice-over clips using ElevenLabs for the new marketing campaign." },
  { label: "Infra Audit", value: "Review all connected GitHub repos for outdated npm dependencies and open PRs automatically." },
  { label: "Autonomous Outreach", value: "Generate 5 technical articles and syndicate them to Medium, Quora and WordPress using GPT-4o." }
];