const { getContracts } = require('../api/results.routes');
const fs = require('fs');
const path = require('path');
const { appendAudit } = require('../audit/audit.logger');

const FAILURE_REASONS = {
  LEASE_NOT_FOUND: 'LEASE_NOT_FOUND',
  LEASE_REVOKED: 'LEASE_REVOKED',
  LEASE_EXPIRED: 'LEASE_EXPIRED',
  AUDIENCE_MISMATCH: 'AUDIENCE_MISMATCH',
  ISSUER_MISMATCH: 'ISSUER_MISMATCH',
  SCOPE_INSUFFICIENT: 'SCOPE_INSUFFICIENT',
  CONTRACT_INVALID: 'CONTRACT_INVALID',
  PHASE_VIOLATION: 'PHASE_VIOLATION'
};

const LEASES_FILE = path.join(__dirname, '..', '..', 'data', 'leases.json');

function readLease(leaseId) {
  if (!fs.existsSync(LEASES_FILE)) return null;
  const raw = fs.readFileSync(LEASES_FILE, 'utf8');
  try {
    const items = JSON.parse(raw || '[]');
    for (let i = items.length - 1; i >= 0; i -= 1) {
      if (items[i].lease_id === leaseId) return items[i];
    }
    return null;
  } catch (e) {
    return null;
  }
}

function isSubset(requested, allowed) {
  const allowSet = new Set(allowed || []);
  return (requested || []).every(scope => allowSet.has(scope));
}

function buildAuditPayload(base, extras) {
  return Object.assign({}, base, extras);
}

/**
 * Consume a lease in read-only mode.
 * This function performs deterministic, ordered validation and never mutates lease metadata.
 */
function consumeLease(leaseId, request) {
  const phaseFrozen = process.env.PHASE_3B_FROZEN === 'true';
  if (!phaseFrozen) {
    const details = buildAuditPayload(
      { lease_id: leaseId, type: 'CONSUME_DENIED' },
      { failure_reason: FAILURE_REASONS.PHASE_VIOLATION, timestamp: new Date().toISOString() }
    );
    appendAudit(details);
    throw new Error(FAILURE_REASONS.PHASE_VIOLATION);
  }

  const lease = readLease(leaseId);
  if (!lease) {
    const details = buildAuditPayload(
      { lease_id: leaseId, type: 'CONSUME_DENIED' },
      { failure_reason: FAILURE_REASONS.LEASE_NOT_FOUND, timestamp: new Date().toISOString() }
    );
    appendAudit(details);
    throw new Error(FAILURE_REASONS.LEASE_NOT_FOUND);
  }

  if (lease.status === 'revoked') {
    const details = buildAuditPayload(
      { lease_id: leaseId, contract_id: lease.contract_id, issuer: lease.issuer, type: 'CONSUME_DENIED' },
      { failure_reason: FAILURE_REASONS.LEASE_REVOKED, timestamp: new Date().toISOString() }
    );
    appendAudit(details);
    throw new Error(FAILURE_REASONS.LEASE_REVOKED);
  }

  if (lease.status === 'expired') {
    const details = buildAuditPayload(
      { lease_id: leaseId, contract_id: lease.contract_id, issuer: lease.issuer, type: 'CONSUME_DENIED' },
      { failure_reason: FAILURE_REASONS.LEASE_EXPIRED, timestamp: new Date().toISOString() }
    );
    appendAudit(details);
    throw new Error(FAILURE_REASONS.LEASE_EXPIRED);
  }

  if (lease.expires_at && new Date(lease.expires_at) <= new Date()) {
    const details = buildAuditPayload(
      { lease_id: leaseId, contract_id: lease.contract_id, issuer: lease.issuer, type: 'CONSUME_DENIED' },
      { failure_reason: FAILURE_REASONS.LEASE_EXPIRED, timestamp: new Date().toISOString() }
    );
    appendAudit(details);
    throw new Error(FAILURE_REASONS.LEASE_EXPIRED);
  }

  const { audience, issuer, scopes, consumer_id } = request || {};
  const contracts = getContracts(lease.contract_id);
  const bind = contracts && contracts.bind;
  const bindAudience = bind && bind.audience;

  if (bind && (!audience || !bindAudience || audience !== bindAudience)) {
    const details = buildAuditPayload(
      { lease_id: leaseId, contract_id: lease.contract_id, issuer: lease.issuer, type: 'CONSUME_DENIED' },
      { failure_reason: FAILURE_REASONS.AUDIENCE_MISMATCH, timestamp: new Date().toISOString() }
    );
    appendAudit(details);
    throw new Error(FAILURE_REASONS.AUDIENCE_MISMATCH);
  }

  if (!issuer || issuer !== lease.issuer) {
    const details = buildAuditPayload(
      { lease_id: leaseId, contract_id: lease.contract_id, issuer: lease.issuer, type: 'CONSUME_DENIED' },
      { failure_reason: FAILURE_REASONS.ISSUER_MISMATCH, timestamp: new Date().toISOString() }
    );
    appendAudit(details);
    throw new Error(FAILURE_REASONS.ISSUER_MISMATCH);
  }

  if (!scopes || !Array.isArray(scopes) || scopes.length === 0 || !isSubset(scopes, lease.scopes)) {
    const details = buildAuditPayload(
      { lease_id: leaseId, contract_id: lease.contract_id, issuer: lease.issuer, type: 'CONSUME_DENIED' },
      { failure_reason: FAILURE_REASONS.SCOPE_INSUFFICIENT, timestamp: new Date().toISOString() }
    );
    appendAudit(details);
    throw new Error(FAILURE_REASONS.SCOPE_INSUFFICIENT);
  }

  if (!bind || !bind.allowed || bind.contract_id !== lease.contract_id) {
    const details = buildAuditPayload(
      { lease_id: leaseId, contract_id: lease.contract_id, issuer: lease.issuer, type: 'CONSUME_DENIED' },
      { failure_reason: FAILURE_REASONS.CONTRACT_INVALID, timestamp: new Date().toISOString() }
    );
    appendAudit(details);
    throw new Error(FAILURE_REASONS.CONTRACT_INVALID);
  }

  const successPayload = buildAuditPayload(
    {
      type: 'CONSUME',
      lease_id: leaseId,
      contract_id: lease.contract_id,
      issuer: lease.issuer
    },
    {
      audience,
      scope_used: scopes,
      consumer_id,
      timestamp: new Date().toISOString()
    }
  );
  appendAudit(successPayload);

  return { allowed: true };
}

module.exports = { consumeLease, FAILURE_REASONS };
