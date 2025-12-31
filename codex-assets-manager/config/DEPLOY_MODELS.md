Deployment notes — models registry

What this file does
- `models.yaml` is a lightweight repo-owned registry that declares which models
  should be considered available by Codex Manager and local developer tooling.
- It does NOT grant runtime authority. All execution/authorization still flows
  through the Vault and service-level policies.

Recommended deployment steps
1. Commit and push this repository change (already done by automation):

```powershell
git add codex-assets-manager/config/models.yaml codex-assets-manager/config/DEPLOY_MODELS.md
git commit -m "chore(config): enable claude-haiku-4.5 in models registry"
git push
```

2. Notify or trigger Codex Manager to reload configuration:
- If Codex Manager watches the repo, it will pick the change up automatically.
- Otherwise restart the Codex Manager service or call its config-reload endpoint.

3. Verify availability
- Check any `GET /api/models` (if present) in Codex Manager, or confirm via
  the Codex Manager UI that `claude-haiku-4.5` is listed and enabled.
- Confirm Vault continues to enforce execution authority.

Rollback
- To disable quickly: set `enabled: false` and repeat steps 1–3.

Notes
- This is a repo-level convenience registry for builders and dev tooling. If
  your production model routing is managed elsewhere (Vault, model-control API),
  use that system as authoritative and keep this file in sync only for local
  tooling and scans.
