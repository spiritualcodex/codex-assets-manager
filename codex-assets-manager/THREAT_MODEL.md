Codex Vault — Threat Model

This document defines the explicit threat assumptions and defensive posture of the Codex Vault.

It exists to prevent accidental weakening over time.

Assets Being Protected

The Vault protects:

API keys and provider credentials

Execution authority

Runtime permissions

Asset ownership

Audit history

System integrity

Loss of Vault integrity = loss of system control.

Trust Boundaries
Trusted

Vault internal logic

Encrypted secret storage

Verified provider endpoints

Untrusted

All UIs

All apps

All agents

Uploaded project files

Client-side state

Everything outside the Vault is hostile by default.

Primary Threat Vectors
1. UI Compromise

Threat: Malicious UI attempts privileged actions
Mitigation: Server-side auth + capability checks

2. Agent Escalation

Threat: Agent attempts to exceed assigned scope
Mitigation: Per-request permission enforcement

3. Secret Exfiltration

Threat: Keys leaked via logs, responses, or memory
Mitigation: No secret return paths, ephemeral injection

4. Ingest Abuse

Threat: Uploaded app attempts to smuggle secrets or logic
Mitigation: Read-only scanning, .env ignored, no execution

5. Replay Attacks

Threat: Reuse of old approvals or tokens
Mitigation: Short-lived grants, request signing, revocation

6. Privilege Drift

Threat: Gradual weakening of permission checks
Mitigation: Capability-based enforcement + audits

7. Insider Error

Threat: Accidental weakening by trusted developer
Mitigation: Locked architecture + documentation + reviews

Non-Goals (Explicit)

The Vault does not attempt to:

Detect malicious intent inside apps

Sanitize app business logic

Prevent all misuse of approved capabilities

Replace provider-side security

Its job is control, not content judgment.

Threats Accepted by Design

Vault downtime halts execution

Founder key compromise compromises system

Providers may fail independently

These are accepted tradeoffs.

Review Triggers

Revisit this document when:

Adding new roles

Adding cross-asset permissions

Introducing user tiers

Supporting third-party contributors

Exposing new Vault APIs

Philosophy

Every future feature is a potential attack vector.
Assume it will be abused.