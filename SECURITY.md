Codex Vault — Security Policy

The Codex Vault is a critical security boundary.
This document defines how security issues are handled and what guarantees the Vault enforces.

Security Scope

This policy applies to:

Authentication logic

Authorization & permission enforcement

Secret storage and access

Runtime approval logic

Ingest Engine behavior

Audit and activity logging

Provider request mediation

Anything inside this repository is security-critical by default.

Reporting a Security Issue

If you discover a potential vulnerability:

Do not disclose publicly

Do not create a public issue

Document:

What was observed

How it could be exploited

What data or capability could be affected

Report directly to the repository owner (Founder)

All reports are treated as high priority.

Security Guarantees (Hard Rules)

The Vault guarantees:

Secrets are never returned by any API

Secrets never leave Vault memory unencrypted

All privileged actions require explicit authorization

All requests are validated server-side

UI input is never trusted

Agents have zero implicit trust

Logs are append-only and immutable

Breaking any of these guarantees is considered a critical failure.

Failure Mode Philosophy

The Vault is designed to fail closed.

If authentication fails → deny

If authorization is unclear → deny

If provider state is unknown → deny

If integrity checks fail → lock system

Availability is secondary to security.

Access Control

Vault access is role-based and capability-based

v1 supports a Founder-only role

All future roles must be enforced at the Vault level

UI role checks are informational only

Secrets Handling

Secrets are injected per request, per scope

No secrets are stored in apps, shells, agents, or UI

.env files are never trusted for runtime access

Rotation can occur without redeploying clients

Prohibited Changes

The following are strictly forbidden:

Returning secrets in API responses

Adding debug flags that bypass auth

Trusting client-provided roles or permissions

Hardcoding credentials

Silent authorization fallbacks

Any such change must be reverted immediately.

Incident Response

In the event of a suspected compromise:

Lock Vault outbound access

Revoke all active grants

Rotate affected secrets

Preserve audit logs

Investigate before restoring service

Philosophy

Security is not a feature of the Vault.
It is the Vault.