
Codex Vault — API Reference

This document defines the only supported API surface used by the Codex Assets Manager.

All endpoints are authority-enforcing.
No endpoint returns secrets.

Authentication

All requests require a valid Vault session.

GET /vault/session


Response

{
  "identity": "founder",
  "role": "founder",
  "vaultStatus": "secure"
}

Ingest Engine
Upload Project
POST /vault/ingest/upload


Response

{ "ingestId": "abc123" }

Scan Project
GET /vault/ingest/{ingestId}/scan

Performs static analysis on project manifests and files to detect providers, runtime type, and required capabilities.

- No secrets returned (only names)
- Fails closed on ambiguity
- All requests audited

Response

{
  "success": true,
  "data": {
    "ingestId": "abc123",
    "requestId": "scan_abc123_1234567890",
    "status": "success",
    "report": {
      "providers": ["gemini"],
      "runtime": "hybrid",
      "requestedCapabilities": ["ai.gemini.inference"],
      "requiredSecrets": ["GEMINI_API_KEY"],
      "warnings": [],
      "filesScanned": ["package.json", "src/main.js"]
    }
  }
}

Failure (ambiguous providers)

{
  "success": false,
  "error": "Ambiguous providers detected: openai, gemini",
  "code": "AMBIGUOUS_PROVIDERS"
}

Bind to Vault (Phase 3A: Decision Only)
POST /vault/ingest/{ingestId}/bind

Transforms MatchEligibility into a BindDecision.

- Evaluates if match can proceed (all checks from Scan/Eligibility)
- Lists required secret leases (not issued yet — Phase 3B)
- Fails closed if any requirement is unmet

Request Body

{
  "matchEligibility": {
    "ingestId": "abc123",
    "eligible": true,
    "squad": ["openai"],
    "formations": ["ai.openai.inference"],
    "clearance": ["OPENAI_API_KEY"],
    "stadiumRules": "frontend"
  }
}

Success Response (Approved)

{
  "success": true,
  "data": {
    "ingestId": "abc123",
    "requestId": "bind_abc123_1234567890",
    "status": "approved_pending_secrets",
    "decision": {
      "allowed": true,
      "squad": ["openai"],
      "formations": ["ai.openai.inference"],
      "leasesRequired": [
        {
          "name": "OPENAI_API_KEY",
          "type": "secret_lease",
          "status": "pending_issuance"
        }
      ],
      "reasons": []
    }
  }
}

Rejection Response

{
  "success": true,
  "data": {
    "ingestId": "abc123",
    "requestId": "bind_abc123_1234567890",
    "status": "rejected",
    "decision": {
      "allowed": false,
      "leasesRequired": [],
      "reasons": [
        "EMPTY_SQUAD: No providers detected"
      ]
    }
  }
}

Assets
List Assets
GET /vault/assets

Asset Detail
GET /vault/assets/{assetId}

Runtime Control
POST /vault/assets/{assetId}/runtime/start
POST /vault/assets/{assetId}/runtime/pause
POST /vault/assets/{assetId}/runtime/restart


Commands only. No state mutation from client.

Permissions (Capabilities)
GET  /vault/assets/{assetId}/permissions
POST /vault/assets/{assetId}/permissions


Body

{
  "capability": "ai.gemini.inference",
  "enabled": true
}

Logs (Read-Only)
GET /vault/assets/{assetId}/logs/stream


Server-Sent Events or WebSocket

Append-only

Immutable

Providers
GET  /vault/providers
POST /vault/providers/{provider}/rotate
POST /vault/providers/{provider}/pause


No endpoint returns credentials.

Activity Log
GET /vault/activity


Chronological, immutable audit trail.

System (Founder-Only)
POST /vault/system/lock
POST /vault/system/unlock
POST /vault/system/emergency-shutdown


Each requires explicit confirmation.

API Design Rules

Commands over setters

Explicit failure over silent success

Capability-based authorization

No side effects without approval

No hidden permissions

Philosophy

The API does not trust the caller.
It verifies, enforces, and records.

Result Contract Endpoints (Office UI / Read-Only)

These endpoints serve immutable result contracts for visualization in the Office UI.
All results are append-only and fail-closed (missing data → 404 or 412).

GET /vault/ingest/{ingestId}/scan/result

Retrieve the Scan phase result contract.

Response (Success)

{
  "success": true,
  "data": {
    "ingestId": "abc123",
    "contract": {
      "contractVersion": "1.0",
      "registeredAt": "2025-12-31T00:00:00Z",
      "providers": ["openai"],
      "runtime": "frontend",
      "requestedCapabilities": ["ai.openai.inference"],
      "requiredSecrets": ["OPENAI_API_KEY"],
      "filesScanned": ["package.json", "src/main.js"],
      "warnings": []
    },
    "contractHash": "sha256...",
    "retrievedAt": "2025-12-31T00:00:00Z"
  }
}

Response (Not Found)

{
  "success": false,
  "error": "Scan result not found or not yet completed",
  "code": "SCAN_NOT_FOUND",
  "ingestId": "abc123"
}

GET /vault/ingest/{ingestId}/eligibility/result

Retrieve the Eligibility phase result contract.
Fails with 412 if Scan has not completed.

Response (Success)

{
  "success": true,
  "data": {
    "ingestId": "abc123",
    "contract": {
      "contractVersion": "1.0",
      "registeredAt": "2025-12-31T00:00:00Z",
      "eligible": true,
      "rulesetVersion": "1.2",
      "ruleHits": [
        { "id": "PROVIDER_DETECTED", "description": "Provider detected in manifest" },
        { "id": "RUNTIME_VALID", "description": "Runtime type supported" }
      ],
      "reasons": []
    },
    "contractHash": "sha256...",
    "retrievedAt": "2025-12-31T00:00:00Z"
  }
}

Response (Precondition Failed)

{
  "success": false,
  "error": "Scan phase must complete first",
  "code": "PRECONDITION_FAILED",
  "ingestId": "abc123"
}

Response (Not Found)

{
  "success": false,
  "error": "Eligibility result not found or not yet evaluated",
  "code": "ELIGIBILITY_NOT_FOUND",
  "ingestId": "abc123"
}

GET /vault/ingest/{ingestId}/bind/result

Retrieve the Bind phase result contract (Phase 3A: decision only, no secrets issued).
Fails with 412 if Eligibility has not completed.

Response (Success)

{
  "success": true,
  "data": {
    "ingestId": "abc123",
    "contract": {
      "contractVersion": "3a",
      "registeredAt": "2025-12-31T00:00:00Z",
      "allowed": true,
      "squad": ["openai"],
      "formations": ["ai.openai.inference"],
      "leasesRequired": [
        { "name": "OPENAI_API_KEY", "type": "secret_lease", "status": "pending_issuance" }
      ],
      "reasons": []
    },
    "contractHash": "sha256...",
    "retrievedAt": "2025-12-31T00:00:00Z"
  }
}

Response (Precondition Failed)

{
  "success": false,
  "error": "Eligibility phase must complete first",
  "code": "PRECONDITION_FAILED",
  "ingestId": "abc123"
}

Response (Not Found)

{
  "success": false,
  "error": "Bind result not found or not yet decided",
  "code": "BIND_NOT_FOUND",
  "ingestId": "abc123"
}

Office UI Contract Binding Rules

All Office UI panels are:
- Read-only (no mutation buttons)
- Contract-bound (render only from API contracts)
- Fail-closed (missing contracts = LOCKED or HIDDEN)
- Version-visible (contract hash always shown)

Missing Contracts:
- Scan missing → Panel shows LOCKED (404)
- Eligibility missing → Panel HIDDEN (404)
- Bind missing → Panel shows LOCKED (404)

HTTP Errors:
- 404 Not Found → Result contract not available
- 412 Precondition Failed → Prerequisite phase not complete
- 5xx Server Error → Fail-closed (no retry without user action)

✅ What You Have Now

With these endpoints, your Vault now has:

A formal security policy

A documented threat model

A locked API contract with Assets Manager

Result contract endpoints for Office UI (read-only visualization)

This is the level where systems stop drifting and start holding their shape.