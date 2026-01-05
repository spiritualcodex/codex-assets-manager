# Tactical Simulation Engine

This repository contains the **live backend simulation logic** for the Tactic Master interactive football manager system.

## Purpose
- Simulate 90-minute match outcomes based on tactical inputs.
- Calculate dynamic player ratings and performance statistics.
- Generate natural-language player strength descriptors.
- Determine match-level "Top Performer" (Man of the Match) results.

## Scope
- Core logic and mathematical simulation.
- API-first architecture (Node.js/Express/TypeScript).
- Deterministic and probabilistic result generation.
- No frontend UI (test bench only for local verification).

## Architecture
- **Engine Layer**: Pure functions for simulation, ratings, and stats.
- **Routes Layer**: REST API endpoints for match and player interactions.
- **Models Layer**: TypeScript interfaces for Players, Teams, and Matches.
- **Platform**: Render (Web Service).

## Boundaries
- ❌ Do NOT store league standings (Office Manager responsibility).
- ❌ Do NOT handle user accounts or billing.
- ❌ No frontend components for end-users.
- ✅ Emits events for the Codex Office Manager.

## Status
- **Phase 3**: Active (Engine Wiring).
- **Environment**: v1.0 Stable Architecture compliant.

---
**Status:** Live Engine Service. Deployable to Render.