# Copilot Instructions — codex-assets-manager

This repository is a frontend-only control plane that is intentionally powerless without the Vault.
Use these notes to make contributions that are consistent with the project's architecture and developer intent.

1) Big picture (what to keep in mind)
- Frontend-only: the Vault is the single source of truth and authority (see root README).
- Directional flow: Assets Manager (UI) → Vault (API) → Shell / Apps / Agents.
- No secrets, no provider SDKs, and no embedded backend logic in this repo.

2) Key locations (quick links)
- Root README: README.md — authoritative architecture + env guidance.
- Frontend source: codex-assets-manager/src/ (app, ingest, assets, vault, api modules).
- API surface: codex-assets-manager/src/api/ (health.routes.ts, ingest.routes.ts, runtime.routes.ts)
- Ingest & registry: codex-assets-manager/src/ingest/, codex-assets-manager/src/registry/
- Runtime/mediator and permission gates: codex-assets-manager/src/runtime/, codex-assets-manager/src/permissions/
- Audit: codex-assets-manager/src/audit/ (append-only activity model)

3) Project-specific patterns and constraints
- Single env var only: `VITE_VAULT_BASE_URL` — the app expects Vault to provide session/identity.
- Do NOT add keys, tokens, or provider SDKs to the repo.
- UI must not perform business authority decisions — always call the Vault and surface Vault failures.
- Append-only activity stream: prefer immutability for audit/activity views.
- No optimistic UI for control-plane actions that change Vault state.

4) Developer workflows (discoverable guidance)
- Typical local dev: check for `package.json` at repo root or inside `codex-assets-manager/` and run `npm install` then `npm run dev` (docs reference Vite-style setup).
- Tests: repo notes suggest Vitest + Testing Library for component tests; look for `*.test.*` near components.
- Environment: set `VITE_VAULT_BASE_URL` locally; do not place secrets in `.env` files that are committed.

5) Integration points & communication
- Vault API: every action, capability change, or runtime control must be validated by Vault.
- Ingest engine: upload → scan → detect capabilities → bind to Vault (codex-assets-manager/src/ingest/*).
- Runtime mediator: look at `src/runtime/` for how UI talks about runtime state and commands.
- Permissions: UI gating is present but server-side checks are authoritative (see `src/permissions/`).

6) Examples of what to do / not to do
- Do: Add UI pages under `src/ingest/` that call the Vault scan endpoint and render capability discovery.
- Do: Add tests next to components (e.g. `src/assets/AssetList.test.tsx`) using Testing Library.
- Do NOT: Add any code that stores credentials, calls provider SDKs, or performs deployment tasks.

7) PR & commit expectations
- Keep changes focused; follow Conventional Commits if possible.
- Document Vault API surfaces or new frontend routes in `README.md` or `API_REFERENCE.md`.

8) When uncertain
- Stop and ask: if a feature requires local authority or secret handling, confirm with the Vault team.

If you want, I can expand this into checklists for PR reviewers, or add quick code snippets for common Vault API calls used by the UI. Tell me which section to expand.
