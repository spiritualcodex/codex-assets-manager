# Phase 3B — Builder Tasks (Deterministic Execution Plan)

Owner: codex-builder (agent)
Phase: 3B-secret-lease

Overview
--------
This file lists the concrete tasks the builder will execute to implement Phase 3B. Each task is deterministic and must stop on any violation (fail-closed).

Tasks
-----
1. Create secrets service scaffold
   - File: `src/secrets/secrets.service.js`
   - Functions: `mintSecret(leaseId, ttlSeconds)`, `revokeSecret(leaseId)`, `hashMaterial(material)`
   - Behavior: generate cryptographically secure material; write-only to Secrets Vault; return `hash_fingerprint` only.

2. Create leases metadata model
   - File: `src/secrets/lease.model.js`
   - Behavior: persist lease metadata (file-backed JSON or DB adapter). Expose `createLease(metadata)`, `getLease(leaseId)`, `listLeasesByContract(contractId)`, `updateLeaseStatus(leaseId, status)`.

3. Extend audit logger for lease events
   - File: `src/audit/audit.logger.js` (extend existing)
   - Add event types: `LEASE_ISSUED`, `LEASE_REVOKED`, `LEASE_EXPIRED`, `VIOLATION`
   - Ensure append-only write with deterministic payload fields.

4. Add issuance route & controller
   - File: `src/api/lease.routes.js` and `src/secrets/lease.controller.js`
   - Endpoint: `POST /vault/ingest/{ingestId}/lease`
   - Controller: validate Phase 3B, load Bind Contract, validate Eligibility PASS, enforce TTL & scope subset, call `secrets.service.mintSecret`, persist metadata, append audit event, return lease handle.

5. Add revoke route & controller
   - File: `src/api/lease.routes.js` (same router)
   - Endpoint: `POST /vault/lease/{leaseId}/revoke`
   - Controller: verify authority, call `secrets.service.revokeSecret`, update lease metadata status to `revoked`, append audit event.

6. Add list leases route
   - Endpoint: `GET /vault/ingest/{ingestId}/leases` → returns lease metadata for contract/ingest.

7. Tests: issuance/revocation/expiry/violation
   - File: `scripts/test-phase3b-issuance.js`, `scripts/test-phase3b-revoke.js`, `scripts/test-phase3b-violation.js`
   - Scenarios: happy path issuance, TTL missing violation, scope-broaden violation, revocation flips status, expiry marks expired.

8. Update Office UI to display lease metadata only
   - File: `src/office/BindPanel.jsx` (add lease panel or integrate existing)
   - Behavior: call `GET /vault/ingest/{ingestId}/leases` and render metadata (no secret material).

9. Documentation & API Reference
   - Update `API_REFERENCE.md` with new endpoints and schemas.

10. Security & gating
   - Ensure builder agent identity enforcement: only `codex-builder` with `3B-secret-lease` role allowed to POST issuance.
   - Add unit tests for authority gating.

Execution Notes
---------------
- Each task is atomic; commit after each completes and tests pass.
- Any failure during validation must not persist secret or metadata and must emit a `VIOLATION` audit event.
- All returned payloads to clients contain metadata only.

Estimate
--------
Total: ~3–5 hours for a robust proof-of-concept (file-backed storage + simple secrets backing). Production-grade Vault integration may require more work.


# End of Phase 3B tasks
