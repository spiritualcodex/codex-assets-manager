// src/ingest/bind.contract.js
// BindDecision shape
// Defines what a Bind decision looks like
// Does NOT issue secrets yet

function createBindDecision(matchEligibility) {
  if (!matchEligibility) {
    throw new Error('matchEligibility required');
  }

  const issuer = matchEligibility.issuer;
  const audience = matchEligibility.audience;
  const contractId = matchEligibility.contract_id || matchEligibility.ingestId;
  const allowedScopes = matchEligibility.allowed_scopes || matchEligibility.formations || [];
  const policyFlags = matchEligibility.policy_flags;

  if (!issuer) {
    throw new Error('issuer required');
  }

  if (!audience) {
    throw new Error('audience required');
  }

  if (!policyFlags || typeof policyFlags !== 'object') {
    throw new Error('policy_flags required');
  }

  // If match is ineligible, bind is rejected immediately
  if (!matchEligibility.eligible) {
    return {
      ingestId: matchEligibility.ingestId,
      contract_id: contractId,
      issuer,
      audience,
      policy_flags: policyFlags,
      allowed_scopes: allowedScopes,
      allowed: false,
      leasesRequired: [],
      reasons: matchEligibility.errors || [],
      timestamp: new Date().toISOString()
    };
  }

  // If eligible, prepare what leases will be needed (later)
  const leasesRequired = matchEligibility.clearance.map(secretName => ({
    name: secretName,
    type: 'secret_lease',
    status: 'pending_issuance' // Not issued yet
  }));

  return {
    ingestId: matchEligibility.ingestId,
    contract_id: contractId,
    issuer,
    audience,
    policy_flags: policyFlags,
    allowed_scopes: allowedScopes,
    allowed: true,
    squad: matchEligibility.squad,
    formations: matchEligibility.formations,
    leasesRequired,
    reasons: [],
    timestamp: new Date().toISOString()
  };
}

function validateBindDecision(decision) {
  if (!decision) throw new Error('decision required');
  if (typeof decision.allowed !== 'boolean') throw new Error('allowed must be boolean');
  if (!Array.isArray(decision.leasesRequired)) throw new Error('leasesRequired must be array');
  if (!Array.isArray(decision.reasons)) throw new Error('reasons must be array');
  if (!decision.contract_id || typeof decision.contract_id !== 'string') throw new Error('contract_id required');
  if (!decision.issuer || typeof decision.issuer !== 'string') throw new Error('issuer required');
  if (decision.allowed && (!decision.audience || typeof decision.audience !== 'string')) {
    throw new Error('audience required');
  }
  if (decision.allowed && (!Array.isArray(decision.allowed_scopes) || decision.allowed_scopes.length === 0)) {
    throw new Error('allowed_scopes required');
  }
  if (!decision.policy_flags || typeof decision.policy_flags !== 'object') {
    throw new Error('policy_flags required');
  }
  
  // Consistency check: if allowed=false, must have reasons
  if (!decision.allowed && decision.reasons.length === 0) {
    throw new Error('Rejection must include reasons');
  }

  return true;
}

module.exports = { createBindDecision, validateBindDecision };
