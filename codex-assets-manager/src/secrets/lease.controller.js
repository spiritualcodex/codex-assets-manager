const crypto = require('crypto');
const { getContracts } = require('../api/results.routes');
const { mintSecret, revokeSecret } = require('./secrets.service');
const leaseModel = require('./lease.model');
const { appendLeaseEvent, appendViolationEvent } = require('../audit/audit.logger');

const MAX_TTL_SECONDS = parseInt(process.env.MAX_LEASE_TTL_SECONDS || `${90 * 24 * 3600}`, 10);

function isSubset(requested, allowed) {
  const set = new Set(allowed || []);
  return (requested || []).every(s => set.has(s));
}

async function issueLeaseForIngest(ingestId, body, issuer) {
  const requester = issuer;
  if (!requester) {
    const details = { ingestId, reason: 'ISSUER_REQUIRED' };
    appendViolationEvent(details);
    throw new Error('ISSUER_REQUIRED');
  }

  // Fail-closed checks
  if (!process.env.ENABLE_PHASE_3B || process.env.ENABLE_PHASE_3B !== 'true') {
    const details = { ingestId, issuer: requester, reason: 'PHASE_3B_NOT_ENABLED' };
    appendViolationEvent(details);
    throw new Error('PHASE_3B_NOT_ENABLED');
  }

  const entry = getContracts(ingestId);
  if (!entry || !entry.bind) {
    const details = { ingestId, issuer: requester, reason: 'BIND_CONTRACT_MISSING' };
    appendViolationEvent(details);
    throw new Error('BIND_CONTRACT_MISSING');
  }

  const bind = entry.bind;
  const contractId = bind.contract_id || ingestId;

  // eligibility must exist and pass
  if (!entry.eligibility || !entry.eligibility.eligible) {
    const details = { ingestId, contract_id: contractId, issuer: requester, reason: 'ELIGIBILITY_NOT_PASS' };
    appendViolationEvent(details);
    throw new Error('ELIGIBILITY_NOT_PASS');
  }

  if (!bind.allowed) {
    const details = { ingestId, contract_id: contractId, issuer: requester, reason: 'BIND_NOT_APPROVED' };
    appendViolationEvent(details);
    throw new Error('BIND_NOT_APPROVED');
  }

  if (!bind.contract_id) {
    const details = { ingestId, contract_id: contractId, issuer: requester, reason: 'CONTRACT_ID_MISSING' };
    appendViolationEvent(details);
    throw new Error('CONTRACT_ID_MISSING');
  }

  if (!bind.issuer) {
    const details = { ingestId, contract_id: contractId, issuer: requester, reason: 'ISSUER_MISSING' };
    appendViolationEvent(details);
    throw new Error('ISSUER_MISSING');
  }

  if (!bind.policy_flags || typeof bind.policy_flags !== 'object') {
    const details = { ingestId, contract_id: contractId, issuer: requester, reason: 'POLICY_FLAGS_MISSING' };
    appendViolationEvent(details);
    throw new Error('POLICY_FLAGS_MISSING');
  }

  if (requester !== 'codex-builder') {
    const details = { ingestId, contract_id: contractId, issuer: requester, reason: 'ISSUER_NOT_AUTHORIZED' };
    appendViolationEvent(details);
    throw new Error('ISSUER_NOT_AUTHORIZED');
  }

  if (bind.issuer && bind.issuer !== requester) {
    const details = { ingestId, contract_id: contractId, issuer: requester, reason: 'ISSUER_MISMATCH' };
    appendViolationEvent(details);
    throw new Error('ISSUER_MISMATCH');
  }

  const { contract_id, scopes, ttl_seconds, audience } = body || {};
  if (!contract_id) {
    const details = { ingestId, contract_id: contractId, issuer: requester, reason: 'CONTRACT_ID_REQUIRED' };
    appendViolationEvent(details);
    throw new Error('CONTRACT_ID_REQUIRED');
  }

  if (contract_id !== bind.contract_id) {
    const details = { ingestId, contract_id: contractId, issuer: requester, reason: 'CONTRACT_ID_MISMATCH' };
    appendViolationEvent(details);
    throw new Error('CONTRACT_ID_MISMATCH');
  }

  if (!scopes || !Array.isArray(scopes) || scopes.length === 0) {
    const details = { ingestId, contract_id: contractId, issuer: requester, reason: 'SCOPES_REQUIRED' };
    appendViolationEvent(details);
    throw new Error('SCOPES_REQUIRED');
  }

  if (!ttl_seconds || ttl_seconds <= 0) {
    const details = { ingestId, contract_id: contractId, issuer: requester, reason: 'TTL_REQUIRED' };
    appendViolationEvent(details);
    throw new Error('TTL_REQUIRED');
  }

  const policyFlags = bind.policy_flags;
  const maxTtl = Number.isFinite(policyFlags.max_ttl_seconds) && policyFlags.max_ttl_seconds > 0
    ? policyFlags.max_ttl_seconds
    : MAX_TTL_SECONDS;

  if (ttl_seconds > maxTtl) {
    const details = { ingestId, contract_id: contractId, issuer: requester, reason: 'TTL_EXCEEDS_MAX' };
    appendViolationEvent(details);
    throw new Error('TTL_EXCEEDS_MAX');
  }

  // determine allowed scopes from bind contract (support multiple field names)
  const allowedScopes = Array.isArray(bind.allowed_scopes) ? bind.allowed_scopes : null;
  if (!allowedScopes) {
    const details = { ingestId, contract_id: contractId, issuer: requester, reason: 'ALLOWED_SCOPES_MISSING' };
    appendViolationEvent(details);
    throw new Error('ALLOWED_SCOPES_MISSING');
  }
  if (!isSubset(scopes, allowedScopes)) {
    const details = { ingestId, contract_id: contractId, issuer: requester, reason: 'SCOPE_BROADEN' };
    appendViolationEvent(details);
    throw new Error('SCOPE_BROADEN');
  }

  if (!bind.audience) {
    const details = { ingestId, contract_id: contractId, issuer: requester, reason: 'AUDIENCE_MISSING' };
    appendViolationEvent(details);
    throw new Error('AUDIENCE_MISSING');
  }

  if (!audience) {
    const details = { ingestId, contract_id: contractId, issuer: requester, reason: 'AUDIENCE_REQUIRED' };
    appendViolationEvent(details);
    throw new Error('AUDIENCE_REQUIRED');
  }

  if (bind.audience !== audience) {
    const details = { ingestId, contract_id: contractId, issuer: requester, reason: 'AUDIENCE_MISMATCH' };
    appendViolationEvent(details);
    throw new Error('AUDIENCE_MISMATCH');
  }

  // Create lease metadata
  const lease_id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
  const issued_at = new Date().toISOString();
  const expires_at = new Date(Date.now() + ttl_seconds * 1000).toISOString();

  // Mint secret (write-only)
  let fingerprint;
  try {
    const res = await mintSecret(lease_id, ttl_seconds);
    fingerprint = res.hash_fingerprint;
  } catch (e) {
    const details = { ingestId, lease_id, contract_id: contractId, issuer: requester, reason: 'SECRET_PERSIST_FAILED' };
    appendViolationEvent(details);
    throw new Error('SECRET_PERSIST_FAILED');
  }

  const metadata = {
    lease_id,
    contract_id: contractId,
    scopes,
    issued_at,
    expires_at,
    revocable: true,
    status: 'active',
    hash_fingerprint: fingerprint,
    issuer: bind.issuer || requester
  };

  // Persist metadata
  const persisted = leaseModel.createLease(metadata);

  // Audit event
  appendLeaseEvent('LEASE_ISSUED', Object.assign({ lease_id }, metadata));

  // Return lease handle (metadata only)
  return persisted;
}

async function revokeLease(leaseId, actor) {
  const lease = leaseModel.getLease(leaseId);
  if (!lease) {
    appendViolationEvent({ lease_id: leaseId, issuer: actor, reason: 'LEASE_NOT_FOUND' });
    throw new Error('LEASE_NOT_FOUND');
  }
  // If already revoked, fail-closed and emit violation
  if (lease.status === 'revoked') {
    appendViolationEvent({ lease_id: leaseId, contract_id: lease.contract_id, issuer: lease.issuer, reason: 'LEASE_ALREADY_REVOKED' });
    throw new Error('LEASE_ALREADY_REVOKED');
  }

  if (lease.status === 'expired') {
    appendViolationEvent({ lease_id: leaseId, contract_id: lease.contract_id, issuer: lease.issuer, reason: 'LEASE_ALREADY_EXPIRED' });
    throw new Error('LEASE_ALREADY_EXPIRED');
  }

  try {
    await revokeSecret(leaseId);
  } catch (e) {
    // continue to update metadata even if secret file missing
  }

  const updated = leaseModel.updateLeaseStatus(leaseId, 'revoked');
  appendLeaseEvent('LEASE_REVOKED', {
    lease_id: leaseId,
    contract_id: lease.contract_id,
    issuer: lease.issuer,
    actor,
    revokedAt: new Date().toISOString()
  });
  return updated;
}

/**
 * Validate whether a lease is currently usable.
 * If expired, mark as expired and emit event.
 */
function validateLeaseUsable(leaseId) {
  const lease = leaseModel.getLease(leaseId);
  if (!lease) {
    appendViolationEvent({ lease_id: leaseId, reason: 'LEASE_NOT_FOUND' });
    throw new Error('LEASE_NOT_FOUND');
  }

  if (lease.status === 'revoked') {
    appendViolationEvent({ lease_id: leaseId, contract_id: lease.contract_id, issuer: lease.issuer, reason: 'LEASE_REVOKED' });
    throw new Error('LEASE_REVOKED');
  }

  const now = new Date();
  if (lease.expires_at && new Date(lease.expires_at) <= now) {
    // mark expired
    leaseModel.updateLeaseStatus(leaseId, 'expired');
    appendLeaseEvent('LEASE_EXPIRED', {
      lease_id: leaseId,
      contract_id: lease.contract_id,
      issuer: lease.issuer,
      expiredAt: new Date().toISOString()
    });
    throw new Error('LEASE_EXPIRED');
  }

  return true;
}

module.exports = { issueLeaseForIngest, revokeLease, validateLeaseUsable };
