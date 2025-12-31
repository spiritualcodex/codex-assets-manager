// src/ingest/bind.controller.js
// Bind decision handler
// Transforms MatchEligibility -> BindDecision
// No secret issuance yet (Step 2 only)

const { createBindDecision, validateBindDecision } = require('./bind.contract');
const { appendAudit } = require('../audit/audit.logger');

async function handleBindRequest(ingestId, matchEligibility) {
  const requestId = `bind_${ingestId}_${Date.now()}`;

  try {
    // Validate inputs
    if (!ingestId || typeof ingestId !== 'string') {
      const err = new Error('Invalid ingestId');
      err.code = 'BAD_REQUEST';
      throw err;
    }
    if (!matchEligibility) {
      const err = new Error('matchEligibility required');
      err.code = 'BAD_REQUEST';
      throw err;
    }

    // Create decision
    const decision = createBindDecision(matchEligibility);
    decision.ingestId = ingestId;
    decision.requestId = requestId;

    // Validate decision shape
    validateBindDecision(decision);

    // Audit decision
    appendAudit({
      event: 'vault.ingest.bind.decided',
      ingestId,
      requestId,
      allowed: decision.allowed,
      squad: decision.squad,
      leasesRequired: decision.leasesRequired ? decision.leasesRequired.length : 0,
      timestamp: decision.timestamp
    });

    // If decision allows, audit that no secrets were issued yet
    if (decision.allowed) {
      appendAudit({
        event: 'vault.ingest.bind.pending_issuance',
        ingestId,
        requestId,
        message: 'Match eligible; awaiting secret lease issuance (Phase 3B)',
        timestamp: new Date().toISOString()
      });
    }

    return {
      ingestId,
      requestId,
      status: decision.allowed ? 'approved_pending_secrets' : 'rejected',
      decision
    };
  } catch (err) {
    const errCode = err.code || 'BIND_FAILED';

    appendAudit({
      event: 'vault.ingest.bind.error',
      ingestId,
      requestId,
      error: err.message,
      code: errCode,
      timestamp: new Date().toISOString()
    });

    const e = new Error(err.message);
    e.code = errCode;
    e.statusCode = errCode === 'BAD_REQUEST' ? 400 : 422;
    throw e;
  }
}

module.exports = { handleBindRequest };
