## Pull Request Checklist

- [ ] PR describes the **why** and scope clearly
- [ ] Tests added or updated for new behavior
- [ ] Docs updated where applicable
- [ ] Change is scoped to a single concern

Operator actions (if config changed)

- [ ] Config changed → Reload Codex Manager (restart service or call its reload endpoint)

Notes:
- After changing files under `codex-assets-manager/config/` ensure operators perform a controlled reload.
