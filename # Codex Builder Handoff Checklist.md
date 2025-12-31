# Codex Builder Handoff Checklist

This document confirms readiness for Codex Builder execution.

## ✅ Vault Repository Status

### Documentation Complete
- ✅ `README.md` — Repository overview
- ✅ `SECURITY.md` — Security policy (from your docs)
- ✅ `THREAT_MODEL.md` — Threat assumptions (from your docs)
- ✅ `API_REFERENCE.md` — API contract (from your docs)
- ✅ `ARCHITECTURE.md` — Internal structure map (created)

### Scaffolding Complete
- ✅ `src/auth/` — Stub files with clear responsibilities
- ✅ `src/permissions/` — Stub files with clear responsibilities
- ✅ `src/secrets/` — Stub files with clear responsibilities
- ✅ `src/ingest/` — Stub files with clear responsibilities
- ✅ `src/registry/` — Stub files with clear responsibilities
- ✅ `src/runtime/` — Stub files with clear responsibilities
- ✅ `src/audit/` — Stub files with clear responsibilities
- ✅ `src/api/` — Stub files with clear responsibilities

### Clarity Gates
- ✅ All module purposes documented
- ✅ Security invariants explicit
- ✅ Non-goals clearly stated
- ✅ Boot sequence defined
- ✅ Entity model established
- ✅ No unresolved "what should this be?" questions

---

## ✅ Assets Manager Repository Status

### Documentation Complete
- ✅ `README.md` — Repository overview with principles

### Scaffolding Complete
- ✅ `src/app/` — AppShell, routes, VaultGuard
- ✅ `src/layout/` — TopBar, Sidebar, MainPanel
- ✅ `src/ingest/` — Upload, scan, bind components
- ✅ `src/assets/` — Asset list and detail views
- ✅ `src/asset-tabs/` — Overview, Permissions, Runtime, Logs, Health
- ✅ `src/vault/` — Provider visibility (no secrets)
- ✅ `src/activity/` — Immutable activity stream
- ✅ `src/system/` — Emergency controls
- ✅ `src/api/` — Vault API client

### Clarity Gates
- ✅ All components mapped to UI design docs
- ✅ Zero local authority principle enforced
- ✅ No secret handling anywhere
- ✅ API client structure defined
- ✅ Route structure clear

---

## 🎯 Handoff Instructions for Codex Builder

### Positioning Statement

```
This repository contains normalized scaffolding from a multi-document 
design phase. All files are authoritative. Your task is to implement, 
wire, and complete the system exactly as specified.

DO NOT redesign. DO NOT reinterpret. DO NOT add features not documented.

If security docs conflict with other docs, security docs win.
If behavior is unclear, fail closed and ask.
```

### Vault Implementation Priority

1. **Phase 1:** Core spine
   - Session validation (auth/)
   - Capability checks (permissions/)
   - Secret storage (secrets/)
   - Audit logging (audit/)

2. **Phase 2:** Ingest engine
   - Project scanning (ingest/)
   - Capability resolution (ingest/)
   - Asset binding (ingest/)

3. **Phase 3:** Runtime control
   - Request mediation (runtime/)
   - Provider integration (runtime/)
   - Asset registry (registry/)

4. **Phase 4:** API surface
   - HTTP routes (api/)
   - Request validation (api/)
   - Response formatting (api/)

### Assets Manager Implementation Priority

1. **Phase 1:** Shell + Auth
   - AppShell layout
   - VaultGuard implementation
   - API client wiring

2. **Phase 2:** Core flows
   - Ingest flow (upload → scan → bind)
   - Assets list
   - Asset detail with tabs

3. **Phase 3:** Controls
   - Runtime controls (start/pause/restart)
   - Permission toggles
   - Provider visibility

4. **Phase 4:** Observability
   - Log streaming
   - Activity feed
   - System controls

---

## 🚨 Critical Constraints for Builder

### Security Hard Rules
1. NO secrets in API responses (Vault)
2. NO secrets in frontend (Assets Manager)
3. NO optimistic updates (Assets Manager)
4. NO client-side authority (both)
5. ALL privileged actions logged (Vault)

### Architecture Hard Rules
1. NO redesign of documented contracts
2. NO new entities without approval
3. NO cross-repo imports
4. NO provider SDKs in Assets Manager
5. NO backend code in Assets Manager

### Implementation Hard Rules
1. Prefer explicit over implicit
2. Fail loudly, not silently
3. Security over convenience
4. Authority over availability
5. Audit over performance

---

## 📋 Definition of Done

### For Vault
- [ ] All stub files implemented
- [ ] All API endpoints working per API_REFERENCE.md
- [ ] All security invariants enforced
- [ ] Audit logging on all privileged actions
- [ ] Boot sequence follows ARCHITECTURE.md
- [ ] Session validation working
- [ ] Capability checks working
- [ ] Secret storage encrypted
- [ ] Ingest engine functional (scan → bind)
- [ ] No secrets in any response

### For Assets Manager
- [ ] All components wired
- [ ] VaultGuard auth flow working
- [ ] Ingest flow complete (upload → scan → bind)
- [ ] Asset list displays Vault data
- [ ] Asset detail tabs functional
- [ ] Runtime controls call Vault APIs
- [ ] Permission toggles call Vault APIs
- [ ] Log streaming implemented
- [ ] Activity feed displays audit events
- [ ] System controls have confirmation modals
- [ ] No secrets anywhere in codebase
- [ ] No optimistic state updates

---

## ✅ Handoff Approved

**Repository State:** Normalized scaffolding complete  
**Next Phase:** Codex Builder implementation  
**Estimated Complexity:** High (security-critical system)  
**Recommended Approach:** Sequential phases, not parallel  

**Critical Success Factor:** Respect documented contracts exactly.

---

## 🔄 Post-Implementation Validation

After Codex Builder completes:

1. **Security audit:**
   - Verify no secrets in responses
   - Verify no secrets in frontend
   - Verify all privileged actions logged
   - Verify capability enforcement working

2. **Flow validation:**
   - Test ingest flow end-to-end
   - Test runtime controls
   - Test permission toggles
   - Test log streaming

3. **Contract compliance:**
   - API matches API_REFERENCE.md
   - Boot sequence matches ARCHITECTURE.md
   - Security invariants hold

**If any check fails: stop and fix before proceeding.**

---

## 📞 Support During Implementation

If Codex Builder encounters:
- Ambiguous security decisions → Fail closed, log, request clarification
- Missing specifications → Reference ARCHITECTURE.md and API_REFERENCE.md
- Design conflicts → Security docs take precedence

**Golden rule:** When uncertain, deny and log.
