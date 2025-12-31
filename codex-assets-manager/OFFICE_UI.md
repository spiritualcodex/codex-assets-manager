## Office UI — Glass Wall Architecture

**Status:** ✅ COMPLETE (Phase 2 Step 1)

**Acceptance Criteria:** All 10 criteria passing

---

## What is the Office UI?

The **Office UI** is a read-only visualization layer for Vault Ingest contracts.

It is **not** a control plane.  
It is **not** a decision engine.  
It is **not** coupled to Vault logic.

**It is a glass wall.**

Humans and agents look through it to see what the system decided.  
Nothing flows back except observation.

---

## Architecture

```
Vault (Authority)
  ├── GET /vault/ingest/{ingestId}/scan/result
  ├── GET /vault/ingest/{ingestId}/eligibility/result
  └── GET /vault/ingest/{ingestId}/bind/result
        ↓
    [Contract Fetching]
        ↓
  Office UI (Glass Wall)
  ├── ScanPanel (🎯 Kickoff)
  ├── EligibilityPanel (🔍 VAR Check)
  └── BindPanel (📋 Match Sheet)
        ↓
  [Read-Only Rendering]
        ↓
  Human / Agent Eyes (Observation Only)
```

---

## Component Structure

### 1. ScanPanel — Kickoff Phase
**Displays:** Static analysis results (verbatim, unfiltered)

```
Asset ID:                  abc123
Contract Version:          1.0
Hash:                      sha256...
Scanned At:                2025-12-31T00:00:00Z

Raw Findings (Verbatim):
  Providers:               ["openai"]
  Runtime:                 "frontend"
  Requested Capabilities:  ["ai.openai.inference"]
  Required Secrets:        ["OPENAI_API_KEY"]
  Files Scanned:           ["package.json", "src/main.js"]
```

**Fail-Closed Rule:**  
If contract missing → LOCKED (shows error)

**Buttons:**  
- 📋 Copy JSON (read-only)
- 💾 Export JSON (read-only)

---

### 2. EligibilityPanel — VAR Check Phase
**Displays:** Rule evaluation results

```
Status:                    ✅ PASS
Ruleset Version:           1.2
Contract Hash:             sha256...

Rules Applied:
  PROVIDER_DETECTED        Provider detected in manifest
  RUNTIME_VALID            Runtime type supported
```

**Fail-Closed Rule:**  
If contract missing → HIDDEN (panel returns null, not shown)

**Buttons:**  
- 📋 Copy JSON
- 💾 Export JSON

---

### 3. BindPanel — Match Sheet Phase
**Displays:** Bind decision contract (Phase 3A: no secrets issued yet)

```
Contract ID:               abc123
Decision:                  ✅ ALLOWED
Contract Version:          3a
Hash:                      sha256...

🔒 PRE-ISSUANCE (Unsigned Contract)

Allowed Scopes:
  Squad:                   ["openai"]
  Formations:              ["ai.openai.inference"]

Required Leases (Phase 3B Pending):
  OPENAI_API_KEY           pending_issuance
```

**Fail-Closed Rule:**  
If contract missing → LOCKED (shows error)

**Watermark:**  
"PRE-ISSUANCE" shown if unsigned (Phase 3A)

**Buttons:**  
- 📋 Copy JSON
- 💾 Export JSON

**What's NOT Present:**
- ❌ No "Issue", "Approve", "Edit" buttons
- ❌ No submission forms
- ❌ No editable fields
- ❌ No secret generation

---

## Result Contract Endpoints

All endpoints are fail-closed and audit-logged by Vault.

### GET /vault/ingest/{ingestId}/scan/result
Returns immutable Scan phase contract.  
**Status on Error:** 404 (not found), 500 (server error)

### GET /vault/ingest/{ingestId}/eligibility/result
Returns immutable Eligibility phase contract.  
**Status on Error:** 404 (not found), 412 (precondition failed: Scan not complete), 500

### GET /vault/ingest/{ingestId}/bind/result
Returns immutable Bind phase contract (Phase 3A).  
**Status on Error:** 404 (not found), 412 (precondition failed: Eligibility not complete), 500

---

## Rendering Rules

### Contract-Bound
Panels render **only** from API contracts.  
No UI-side derivations, calculations, or inference.

### Fail-Closed
- Missing contract → 404 → Panel LOCKED or HIDDEN
- HTTP error → Fail-closed (no retry)
- Ambiguous data → Vault rejected (UI never sees it)

### Zero Business Logic
- No rule re-evaluation
- No eligibility scoring
- No secret generation
- No filtering or sorting
- Status colors from contract only (no UI inference)

### Version-Visible
- Contract version always displayed
- Contract hash always shown
- Version mismatch visibly flagged
- Snapshot export hash matches contract

---

## Snapshot Export

**Functionality:**
- Copy JSON to clipboard
- Export as JSON file

**Byte-Accuracy:**
Exports use `JSON.stringify(contract, null, 2)` — byte-for-byte match.  
No field transformations.  
Contract hash stable across exports.

**Files Generated:**
- `scan-contract.json`
- `eligibility-contract.json`
- `bind-contract.json`

---

## CSS Styling

**Theme:** Minimalist, high-contrast, read-only aesthetic

**Color Palette:**
- Primary: Dark blue (`#1a1a2e`)
- Success: Green (`#2ecc71`)
- Danger: Red (`#e74c3c`)
- Warning: Orange (`#f39c12`)
- Locked: Gray (`#bdc3c7`)
- Pre-Issuance: Orange (`#f39c12`)

**Responsive:**
- Desktop: 3-column grid layout
- Tablet: 2-column layout
- Mobile: 1-column layout

---

## Testing

**Test File:** `scripts/test-office-ui.js`

**Acceptance Criteria (All Passing ✅):**

1. ✅ UI renders only from contracts
2. ✅ Missing contract = fail-closed
3. ✅ Zero business logic in UI
4. ✅ Snapshot export matches contract byte-for-byte
5. ✅ No mutation paths exist
6. ✅ Contract version mismatch visibly flagged
7. ✅ Proper fail-closed on HTTP errors
8. ✅ Zero UI-side business logic
9. ✅ Immutable contract binding (glass wall)
10. ✅ Version visibility (contract hash always shown)

**Run Tests:**
```bash
node scripts/test-office-ui.js
```

---

## What's Next (Phase 3B)

Once Office UI is verified as passive and read-only:

### Phase 3B — Secret Lease Issuance
- Define `Lease` structure (name, issuer, expiry, revocation)
- Implement `secrets.service.js` (issue/revoke/rotate)
- Update `bind.controller.js` to issue leases
- Mark leases as `issued` instead of `pending_issuance`
- Sign Bind contract

**Key Principle:** Secret handling stays in Vault, never touches UI.

---

## Key Invariants (Non-Negotiable)

| Invariant | Why | Enforcement |
|-----------|-----|------------|
| Read-only panels | No UI coupling to Vault logic | No mutation buttons; no form handlers |
| Contract-bound rendering | Deterministic, testable | Props = API response only |
| Fail-closed on missing data | Security-first | 404/412 → LOCKED/HIDDEN |
| No business logic | Single source of truth (Vault) | Component = pure render function |
| Version visibility | Auditability | Hash + version always shown |
| Byte-accurate exports | Contract integrity | JSON.stringify, no transforms |

---

## Football Metaphor Summary

| Phase | Analogy | UI Panel | Status |
|-------|---------|---------|--------|
| Scan | Kickoff / Pre-Match Inspection | ScanPanel | 🎯 Shows raw state |
| Eligibility | VAR Check / Team Sheet Validation | EligibilityPanel | 🔍 Shows rule verdict |
| Bind | Match Approval / Lineup Sheet | BindPanel | 📋 Shows contract preview |

No substitutions. No manager input. The referee (Vault) decides.

---

## Files Created

| File | Purpose |
|------|---------|
| `src/api/results.routes.js` | Serve immutable result contracts |
| `src/office/OfficeUI.jsx` | Main container + ingest selector |
| `src/office/ScanPanel.jsx` | Scan contract visualization |
| `src/office/EligibilityPanel.jsx` | Eligibility contract visualization |
| `src/office/BindPanel.jsx` | Bind contract visualization |
| `src/office/OfficeUI.css` | Styling (minimalist, high-contrast) |
| `scripts/test-office-ui.js` | Acceptance criteria validation |

---

## Deployment Notes

**For Render / Cloud Hosts:**
1. Mount Office UI alongside Assets Manager server
2. Add `GET /vault/ingest/{ingestId}/scan/result` to route stack
3. Add `GET /vault/ingest/{ingestId}/eligibility/result` to route stack
4. Add `GET /vault/ingest/{ingestId}/bind/result` to route stack
5. Serve React build from `src/office/`

**Environment:**
- `VITE_VAULT_BASE_URL`: Vault API endpoint (e.g., `http://localhost:3000`)

**No Secrets in This Layer:**
Office UI is stateless. All authority lives in Vault.

---

**Status:** ✅ READY FOR PRODUCTION  
**Last Updated:** 2025-12-31  
**Next Phase:** Phase 3B (Secret Lease Issuance)
