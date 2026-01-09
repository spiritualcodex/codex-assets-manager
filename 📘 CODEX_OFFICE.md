📘 CODEX_OFFICE.md

Codex Office & Phase 13 Harness – System Definition

Scope: Office shell, harness, diagnostics, orchestration
Non-scope: Gameplay logic, simulation rules

1. Codex Office – Purpose

The Codex Office is the managerial and observability layer of the Codex ecosystem.

It does not simulate games.
It does not calculate results.

It provides:

Navigation shell

System status visibility

Event logging

Test harness & diagnostics

Controlled execution surfaces

Think of it as:

The manager’s office overlooking the stadium
(not the pitch itself)

2. Office Responsibilities (Locked)
What the Office DOES

Hosts the React application shell

Displays system-wide status

Routes between screens

Shows engine connection health

Logs and visualises events

Provides harness controls

What the Office DOES NOT Do

❌ Match simulation

❌ League table calculation

❌ Season logic

❌ Business rules

❌ Data persistence

Those belong to the simulation engine.

3. Phase 13 – Test Harness (Authoritative)

The Phase 13 Harness is now a first-class system console.

Builder Updates (Confirmed)

The harness has been reworked and upgraded with:

UI Enhancements

Connection status pills

Engine

Match

Validation

Info-tooltipped headers (ⓘ)

Structured summaries:

Engine state

Match result

Validation outcome

Raw payload toggles (inspect I/O)

Enhanced event log layout

Chronological

Readable

Non-noisy

Styling Enhancements

Harness-specific layout

Status pill styles

Info icon components

Detail list formatting

Screenshots not captured
(no runnable frontend dev server in this artifact)

4. Harness Role in the System

The harness is:

A truth recorder

A debugging lens

A confidence tool

It answers:

Did the engine connect?

What was sent?

What came back?

Was the result valid?

It is intentionally read-only + controlled-action.

5. Relevant File Structure (Office)
src/
 ├─ App.tsx
 ├─ AppRoutes.tsx
 ├─ components/
 │   ├─ AppShell.tsx
 │   ├─ GlobalNav.tsx
 │   ├─ GlobalErrorBanner.tsx
 │   ├─ GlobalLoadingOverlay.tsx
 │   └─ Icons.tsx
 ├─ harness/
 │   ├─ HarnessScreen.tsx
 │   ├─ HarnessRoute.tsx
 │   └─ Harness.stories.tsx
 ├─ hooks/
 │   └─ useHarnessWebSocket.ts
 ├─ config/
 │   ├─ env.ts
 │   ├─ auth.ts
 │   └─ harness.ts
 └─ styles/
     └─ app.css

6. Office Mental Model

Office = Manager

UI = Displays & controls

Engine = Law

Harness = Black box recorder

The Office never “decides” outcomes.

7. Status

✅ Office shell stable
✅ Harness upgraded
✅ Event visibility clear
🔄 UI polish only (no logic changes)