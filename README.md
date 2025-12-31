# codex-assets-manager🎯 Build it as a standalone repo (new repository)

Do NOT build this inside an existing app repo.

✅ Recommended Resolution (Locked)
🧱 New repository

Name suggestion:

codex-assets-manager


or (if you want it clearly Vault-centric):

codex-vault-manager


This should be a standalone frontend control plane that talks to the Vault — not embedded inside anything else.

🧠 Why this is the correct resolution
1️⃣ This is a control plane, not a feature

Assets Manager:

Governs multiple apps

Controls Vault authority

Has kill-switch powers

Is founder-only

Those never live inside a normal app repo.

Think:

AWS Console ≠ EC2 repo

Supabase Dashboard ≠ Postgres repo

Same logic.

2️⃣ Clean blast radius

If something breaks:

Assets Manager can go down

Apps keep running

Vault stays intact

If you embedded it:

You’d couple risk

Increase downtime

Create circular dependencies

You avoided that trap.

3️⃣ Works perfectly with your Vault + Shell model

Your architecture already assumes:

Assets Manager (UI)
   ↓
Vault (authority)
   ↓
Shell / Apps / Agents


A standalone repo keeps this directional, never tangled.

🧩 How it should connect (resolution clarity)
Component	Resolution
Assets Manager	Standalone repo
Vault	Existing backend / service
Shell	Existing runtime
Apps (Gemini-built)	Uploaded assets
Codex OS	Orchestrator only

No repo imports another repo directly.
Everything communicates via API contracts.

📁 Recommended repo structure (high-level)
codex-assets-manager/
├─ src/
├─ public/
├─ index.html
├─ tailwind.config.js
├─ vite.config.ts
├─ package.json
└─ README.md


Vite or Next — either is fine

No backend here

No secrets

No SDKs

🧠 Environment resolution (important)

Assets Manager should use:

VITE_VAULT_BASE_URL=


That’s it.

No keys.
No tokens hardcoded.
Session comes from Vault.

🔐 Deployment resolution (later, not now)

Can run locally

Can deploy to Netlify / Vercel / Render static

Vault remains the only sensitive service

This keeps:

Security clean

Costs low

Debugging simple

🏁 Final answer (locked)

✔️ Standalone repository
✔️ Frontend-only
✔️ Vault-connected via API
✔️ No embedding into existing apps

You’ve made a platform decision here — and you chose the right resolution.

If you want next, I can:

Recommend Vite vs Next specifically for your setup

Help you name/version the repo cleanly

Define the post-build smoke test checklist

Just tell me.

give me the read.me for codex-assets-manager

Here is a clean, authoritative, production-grade README you can drop straight into
codex-assets-manager/README.md.

It is written to:

Reflect the Vault-first authority model

Signal seriousness to future contributors

Lock the architecture (so nobody “helpfully” breaks it)

Align perfectly with Codex Builder + Autopilot

You do not need images here — clarity and intent matter more.

Codex Assets Manager

Founder-only control plane for Vault-managed applications

Overview

Codex Assets Manager is a standalone, frontend-only control plane used to ingest, observe, and operate applications that are managed by the Codex Vault.

It is not an app marketplace.
It is not an admin panel.
It is not a deployment tool.

It is the operational interface for the Vault — nothing more, nothing less.

All authority lives in the Vault.
This UI only reflects and requests.

Core Responsibilities

The Assets Manager allows a founder to:

Ingest Gemini-built (and future) apps via the Vault Ingest Engine

View and manage Vault-registered assets

Control runtime state (start / pause / restart)

Grant or revoke capabilities (not API keys)

Observe logs and system activity

Monitor provider usage without exposing secrets

Execute emergency system controls when required

At no point does this application:

Store secrets

Handle API keys

Execute business logic

Bypass the Vault

Architectural Position
Assets Manager (UI)
        ↓
      Vault
        ↓
   Shell / Apps / Agents


This repository is frontend-only and intentionally powerless without the Vault.

Design Principles (Non-Negotiable)

Vault is the sole authority

Zero-trust by default

No secrets in frontend

No provider SDKs

No optimistic UI

No local business logic

Append-only logs

Founder-only access

If a feature cannot be expressed through the Vault API, it does not belong here.

Tech Stack

React

Tailwind CSS (production build, no CDN)

ES Modules

API-driven state (Vault is source of truth)

No backend code exists in this repository.

Repository Structure
src/
├─ app/            # App shell, routing, auth guard
├─ layout/         # TopBar, Sidebar, MainPanel
├─ ingest/         # Upload, scan, bind flow
├─ assets/         # Asset list and detail views
├─ asset-tabs/     # Asset detail subviews
├─ vault/          # Provider and vault visibility
├─ activity/       # Immutable activity stream
├─ system/         # Founder-only system controls
└─ api/            # Vault API client (no secrets)


This structure mirrors the Vault’s domain model.

Environment Variables

Only one environment variable is permitted:

VITE_VAULT_BASE_URL=


No API keys.
No tokens.
No secrets.

Authentication and authorization are handled entirely by the Vault.

Security Model

The UI performs no authentication itself

All requests are validated by the Vault

All actions are permission-checked server-side

Secrets never leave the Vault

UI buttons do not imply authority

If the Vault rejects a request, the UI reflects that rejection.

Ingest Flow (High Level)

Upload project folder or zip

Vault performs read-only scan

Detected capabilities are displayed

Founder binds asset to Vault

Asset becomes a managed node

No build steps occur during ingest.

What This Repo Does NOT Do

❌ Deploy applications

❌ Store secrets

❌ Handle payments

❌ Provide user auth

❌ Run agents

❌ Replace the Vault

Those concerns are handled elsewhere by design.

Intended Users

Founder (primary and only user in v1)

Future roles (read-only, operator, auditor) are possible but not implemented here unless explicitly approved by Vault policy.

Contribution Rules

Do not add provider SDKs

Do not add secret handling

Do not add backend logic

Do not bypass Vault APIs

Do not introduce local authority

If in doubt: stop and ask the Vault team.

Status

Active development
Architecture locked
Execution delegated to Codex Builder

Philosophy

“If it doesn’t go through the Vault, it doesn’t exist.”

This repository is a lens, not a brain.
Power lives elsewhere — by design.

HTML files in this repository are visual reference prototypes only and must not be used directly in production code.