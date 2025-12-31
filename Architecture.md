# Codex Vault — Architecture Reference

This document provides the internal structure map for Codex Builder implementation.

## Module Map

```
src/
├─ auth/          # Session + identity validation
├─ permissions/   # Capability enforcement
├─ secrets/       # Provider key storage + rotation
├─ ingest/        # Scan, resolver, binder
├─ registry/      # Assets + ownership
├─ runtime/       # Approval + mediation
├─ audit/         # Immutable logs
└─ api/           # HTTP interface
```

**Purpose:** This tells the Builder *where* things live without telling it *how*.

## Data Model (Entities)

The Vault operates on these core entities:

- **Asset** — A managed application registered in the Vault
- **Capability** — A permission scope (e.g., `ai.gemini.inference`)
- **Provider** — An external service (Gemini, OpenAI, etc.)
- **Grant** — A time-bound permission approval
- **Session** — An authenticated Vault connection
- **AuditEvent** — An immutable log entry

No schemas or fields defined yet — implementation decides storage.

## Boot Sequence

Vault startup order (prevents race conditions):

1. Load configuration
2. Load providers
3. Load permissions
4. Lock system until healthy
5. Accept requests

**Critical:** Vault fails closed. If any step fails, deny all requests.

## Explicit Non-Goals

The Vault does NOT implement (Builder must not add):

- ❌ Background jobs
- ❌ User tiers
- ❌ Billing logic
- ❌ UI components
- ❌ Agent autonomy
- ❌ Database choice (Supabase/Postgres/etc.)
- ❌ Encryption implementation details
- ❌ Provider SDK code
- ❌ Caching layers
- ❌ Performance optimizations
- ❌ Multi-region logic

These come *after* the secure spine exists.

## Implementation Principles

1. **All authority lives in the Vault** — No client-side trust
2. **Secrets never leave** — Injection only, never return
3. **Capability-based permissions** — Not role-based initially
4. **Append-only audit** — No log deletion
5. **Fail closed** — Deny on uncertainty

## File-Level Responsibilities

### `auth/`
- Session creation and validation
- Identity verification
- Token management (if needed)

### `permissions/`
- Capability checks
- Grant enforcement
- Permission queries

### `secrets/`
- Encrypted storage
- Key rotation
- Ephemeral injection

### `ingest/`
- Project scanning
- Capability resolution
- Asset binding

### `registry/`
- Asset storage
- Ownership tracking
- Metadata management

### `runtime/`
- Request approval
- Provider mediation
- Kill-switch controls

### `audit/`
- Immutable event logging
- Activity streams
- Audit queries

### `api/`
- HTTP routes
- Request validation
- Response formatting

## Security Invariants

These must hold at all times:

1. No API endpoint returns secrets
2. All requests validated server-side
3. UI input never trusted
4. Logs are append-only
5. Capability checks precede execution

Breaking these is a **critical failure**.

## Next Phase Triggers

Revisit architecture when:

- Adding new roles beyond Founder
- Supporting cross-asset permissions
- Introducing user tiers
- Allowing third-party contributors
- Exposing new Vault APIs

## Builder Execution Notes

- Prefer explicit over implicit
- Fail loudly, not silently
- Security over convenience
- Authority over availability
- Audit over performance

**Philosophy:** If Codex Builder is uncertain about authority, it should deny and log.
