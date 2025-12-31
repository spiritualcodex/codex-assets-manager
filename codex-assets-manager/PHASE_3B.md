# Phase 3B — Secret Lease Issuance (Authoritative Spec)

Status: DRAFT → Execution authorized by user (Phase=3B unlock required in MD)

Goal
----
Issue time-bound, scope-bound, revocable secrets derived only from an approved Bind Contract. No secret exists without an approved Bind Contract. Bind Contracts are immutable during issuance.

Non-Negotiable Invariants
------------------------
- No lease without an approved Bind Contract (Eligibility == PASS).
- TTL required; no perpetual secrets.
- Least privilege: lease scopes must be a subset of `allowed_scopes` in the Bind Contract.
- Single audience: lease tied to a single `audience` value.
- Immediate revocation supported; rotation allowed but not automatic.
- Zero secret exposure beyond executor (read-never by UI).
- Fail-closed: any validation failure halts issuance and emits a violation report.

Authority Grant (Phase-Bound)
-----------------------------
Agent: `codex-builder`
Phase: `3B-secret-lease`

Allowed actions:
- `derive-secret-from-bind-contract`
- `set-ttl`
- `attach-scope-subset`
- `write-audit-event`
- `persist-lease-metadata`

Forbidden actions:
- `modify-bind-contract`
- `issue-without-ttl`
- `broaden-scopes`
- `expose-secret-to-ui`
- `reuse-expired-lease`

Inputs (Must Exist or Fail-Closed)
----------------------------------
- Bind Contract (vX) — immutable
  - `contract_id`
  - `allowed_scopes[]`
  - `issuer`
  - `audience`
  - `policy_flags`
- Eligibility Result: `eligible === true`
- Phase marker unlocked (Phase=3B enabled in system MD/config)

If any input is missing or invalid → HARD STOP + emit violation audit event.

Outputs (Artifacts)
-------------------
- Secret Lease (metadata only):
  - `lease_id` (UUID)
  - `contract_id`
  - `scopes[]` (subset of contract allowed_scopes)
  - `issued_at` (ISO)
  - `expires_at` (ISO)
  - `revocable` = true
  - `status` = `active` | `revoked` | `expired`
  - `hash_fingerprint` (sha256 of secret material)
- Audit Event: deterministic, append-only JSONL with event types `LEASE_ISSUED`, `LEASE_REVOKED`, `LEASE_EXPIRED`, `VIOLATION`

Lease Rules
-----------
- TTL (time-to-live) is required and must be within system policy bounds (e.g., max 90d) unless `policy_flags` allow otherwise.
- Lease scopes must be chosen to grant least privilege; builder must not broaden scopes beyond contract.
- Audience must match Bind Contract `audience` exactly.
- Immediate revocation flips `status` to `revoked` and sets `expires_at` to revocation time.
- Rotation must create a new lease (new `lease_id`) and mark old lease `revoked`.

Storage Model (Minimal)
-----------------------
- Secrets Vault: stores secret material; write-only API; secrets are write-only and never returned to Office UI.
- Leases Table: metadata store (persist lease metadata only). Implementation: file-backed JSON or simple DB table.
- Audit Log: append-only JSONL file (already present in repo). Each event must include deterministic fields: `event_id`, `type`, `lease_id`, `contract_id`, `issuer`, `timestamp`, `details`.

Builder Execution Steps (Deterministic)
---------------------------------------
1. Verify Phase == `3B` unlocked.
2. Load Bind Contract by `contract_id`. Validate signature if present.
3. Verify Eligibility Result is PASS.
4. Validate inputs: `issuer`, `audience`, `policy_flags` conform to policy.
5. Compute lease metadata:
   - Choose `scopes[]` subset (exact per request; enforce subset check).
   - Validate TTL is present and within allowed maxima.
6. Mint secret material via Secrets Vault (`secrets.service.mintSecret(leaseId, ttl)`):
   - Generate cryptographically secure material.
   - Compute `hash_fingerprint` = `sha256(material)`.
   - Write material to Secrets Vault (write-only).
7. Persist lease metadata to Leases Table (exclude secret material).
8. Emit append-only Audit Event `LEASE_ISSUED` with deterministic payload.
9. Return Lease Handle (metadata only): { `lease_id`, `contract_id`, `issued_at`, `expires_at`, `scopes`, `status`, `hash_fingerprint` }.

Zero Secret Exposure
--------------------
- Executor returns only lease metadata and handle. Secret material never leaves Secrets Vault and is not accessible by UI or other non-authorized agents.

APIs (Phase 3B)
---------------
- POST `/vault/ingest/{ingestId}/lease` — Request body: `{ contract_id, scopes[], ttl_seconds, audience }` → Response: `{ lease_handle }`.
  - Preconditions: Bind Contract exists and approved; Eligibility PASS; Phase=3B enabled.
- POST `/vault/lease/{leaseId}/revoke` — Revoke lease immediately; response: updated lease metadata.
- GET `/vault/ingest/{ingestId}/leases` — List lease metadata for given ingest/contract (Office UI reads metadata only).

Office UI (Read-Only Extension)
-------------------------------
- Displays lease metadata only: `lease_id`, `status`, `expires_at`, `scopes`, `contract_id`.
- Never displays secret material.
- Missing lease → panel hidden.

Acceptance Criteria (Phase 3B)
------------------------------
- ✅ No lease without approved bind contract.
- ✅ TTL enforced at issuance; no perpetual leases.
- ✅ Scope subset enforced.
- ✅ Revocation flips status immediately and audit logged.
- ✅ UI never sees secret material.
- ✅ Expired lease auto-invalid (cron or access-time check updates status to `expired`).
- ✅ Audit trail complete for issuance/revocation/violations.
- ✅ Builder halts on any violation and emits `VIOLATION` audit event.

Failure Modes & Violation Reporting
----------------------------------
- Any validation failure → do not mint secret, do not persist lease, emit `VIOLATION` event, return error to caller.
- Violation events include which invariant failed and full deterministic context (ingestId, contract_id, requester, timestamp).

Tests & Verification
--------------------
- Unit tests: subset enforcement, TTL bounds, audience match, hash fingerprint generation.
- Integration tests: end-to-end issuance (happy path), revocation, expiry, violation scenarios.
- Security tests: ensure UI endpoints never return secret material; leak tests.

Operational Notes
-----------------
- Rotation: create new lease + revoke old lease; maintain audit chain.
- Auto-expiry: background job to mark expired leases (could be lazy-evaluated on access).
- Secrets Vault must be hardened and isolated; read-never principle enforced at API layer.

Deployment Checklist
--------------------
- Add `secrets.service` to repo and wire to trusted Vault backend.
- Add Leases Table storage adapter (file-backed for POC; DB for production).
- Add `POST /vault/ingest/{ingestId}/lease` and `POST /vault/lease/{leaseId}/revoke` routes.
- Add tests and run `scripts/test-office-ui.js` + Phase 3B tests.


# End of Phase 3B spec
