OPERATIONS — Codex Manager runtime notes

Config changes
- When files under `codex-assets-manager/config/` (for example `models.yaml`) are modified
  operators must perform a controlled reload of Codex Manager. This repository-level
  config is a convenience registry for builders and tooling — it does not grant
  execution authority.

Reload options (pick what applies in your environment)
- Restart the Codex Manager service/process.
- If Codex Manager exposes a configuration reload endpoint, call it (e.g., `POST /admin/config/reload`).

Verification
- Confirm the new config is visible in the Codex Manager UI or via any `GET /api/models` endpoint.
- Ensure Vault remains authoritative for execution and secrets — this file is only a hint for tooling.

Rollback
- To disable a model or revert config quickly: update `models.yaml` (set `enabled: false`) and repeat reload steps.
