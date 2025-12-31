// src/ingest/bind.contract.js
// BindDecision shape
// Defines what a Bind decision looks like
// Does NOT issue secrets yet

function createBindDecision(matchEligibility) {
  if (!matchEligibility) {
    throw new Error('matchEligibility required');
  }

  // If match is ineligible, bind is rejected immediately
  if (!matchEligibility.eligible) {
    return {
      ingestId: matchEligibility.ingestId,
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
  
  // Consistency check: if allowed=false, must have reasons
  if (!decision.allowed && decision.reasons.length === 0) {
    throw new Error('Rejection must include reasons');
  }

  return true;
}

module.exports = { createBindDecision, validateBindDecision };
