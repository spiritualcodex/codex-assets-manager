
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


Response

{
  "providers": ["gemini"],
  "runtime": "hybrid",
  "requestedCapabilities": ["ai.gemini.inference"],
  "warnings": []
}

Bind to Vault
POST /vault/ingest/{ingestId}/bind


Response

{ "assetId": "asset_001" }

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

✅ What You Have Now

With these three files, your Vault now has:

A formal security policy

A documented threat model

A locked API contract with Assets Manager

This is the level where systems stop drifting and start holding their shape.