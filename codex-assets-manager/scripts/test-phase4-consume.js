const assert = require('assert');
const fs = require('fs');
const path = require('path');

process.env.PHASE_3B_FROZEN = 'true';

const results = require('../src/api/results.routes');
const { consumeLease, FAILURE_REASONS } = require('../src/consume/lease.consume');

const leasesFile = path.join(__dirname, '..', 'data', 'leases.json');

function writeLease(lease) {
  const raw = fs.existsSync(leasesFile) ? fs.readFileSync(leasesFile, 'utf8') : '[]';
  const items = JSON.parse(raw || '[]');
  items.push(lease);
  fs.mkdirSync(path.dirname(leasesFile), { recursive: true });
  fs.writeFileSync(leasesFile, JSON.stringify(items, null, 2), 'utf8');
  return lease;
}

function readLeasesFile() {
  return fs.existsSync(leasesFile) ? fs.readFileSync(leasesFile, 'utf8') : '';
}

function listVaultFiles() {
  const vaultDir = path.join(__dirname, '..', 'data', 'secrets_vault');
  if (!fs.existsSync(vaultDir)) return [];
  return fs.readdirSync(vaultDir).slice().sort();
}

function auditLines() {
  const auditPath = path.join(__dirname, '..', 'data', 'audit.log');
  const raw = fs.existsSync(auditPath) ? fs.readFileSync(auditPath, 'utf8') : '';
  return raw
    .split('\n')
    .filter(Boolean)
    .map(line => {
      try {
        return JSON.parse(line);
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean);
}

function findAudit(type, leaseId) {
  const lines = auditLines();
  return lines.find(line => line.type === type && line.lease_id === leaseId);
}

async function run() {
  const suffix = Date.now().toString(36);
  const ingestId = 'phase4-consume';
  const contract = {
    contract_id: ingestId,
    allowed: true,
    allowed_scopes: ['ai.openai.inference', 'ai.openai.embeddings'],
    issuer: 'codex-builder',
    audience: 'app'
  };

  results.registerBindResult(ingestId, contract);

  const lease = writeLease({
    lease_id: `lease-active-${suffix}`,
    contract_id: ingestId,
    scopes: ['ai.openai.inference'],
    issued_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 60 * 1000).toISOString(),
    revocable: true,
    status: 'active',
    hash_fingerprint: 'hash',
    issuer: 'codex-builder'
  });

  const leasesBefore = readLeasesFile();
  const vaultBefore = listVaultFiles();

  // Success path
  const ok = consumeLease(lease.lease_id, {
    audience: 'app',
    issuer: 'codex-builder',
    scopes: ['ai.openai.inference'],
    consumer_id: 'tester'
  });
  assert(ok.allowed === true, 'consume allowed');
  assert(findAudit('CONSUME', lease.lease_id), 'CONSUME audit emitted');

  // Lease file unchanged (no mutation)
  const leasesAfter = readLeasesFile();
  assert(leasesBefore === leasesAfter, 'lease metadata not mutated');

  // Vault untouched
  const vaultAfter = listVaultFiles();
  assert.deepStrictEqual(vaultBefore, vaultAfter, 'vault not touched');

  // Missing lease
  try {
    consumeLease(`missing-lease-${suffix}`, { audience: 'app', issuer: 'codex-builder', scopes: ['ai.openai.inference'] });
    assert(false, 'missing lease should throw');
  } catch (err) {
    assert(err.message === FAILURE_REASONS.LEASE_NOT_FOUND, 'missing lease denied');
    assert(findAudit('CONSUME_DENIED', `missing-lease-${suffix}`), 'CONSUME_DENIED audit emitted');
  }

  // Revoked takes precedence over expiry (order)
  const revoked = writeLease({
    lease_id: `lease-revoked-${suffix}`,
    contract_id: ingestId,
    scopes: ['ai.openai.inference'],
    issued_at: new Date().toISOString(),
    expires_at: new Date(Date.now() - 1000).toISOString(),
    revocable: true,
    status: 'revoked',
    hash_fingerprint: 'hash',
    issuer: 'codex-builder'
  });
  try {
    consumeLease(revoked.lease_id, { audience: 'app', issuer: 'codex-builder', scopes: ['ai.openai.inference'] });
    assert(false, 'revoked lease should throw');
  } catch (err) {
    assert(err.message === FAILURE_REASONS.LEASE_REVOKED, 'revoked denied before expiry');
  }

  // Expired lease denied
  const expired = writeLease({
    lease_id: `lease-expired-${suffix}`,
    contract_id: ingestId,
    scopes: ['ai.openai.inference'],
    issued_at: new Date().toISOString(),
    expires_at: new Date(Date.now() - 1000).toISOString(),
    revocable: true,
    status: 'active',
    hash_fingerprint: 'hash',
    issuer: 'codex-builder'
  });
  try {
    consumeLease(expired.lease_id, { audience: 'app', issuer: 'codex-builder', scopes: ['ai.openai.inference'] });
    assert(false, 'expired lease should throw');
  } catch (err) {
    assert(err.message === FAILURE_REASONS.LEASE_EXPIRED, 'expired denied');
  }

  // Audience mismatch
  try {
    consumeLease(lease.lease_id, { audience: 'other', issuer: 'codex-builder', scopes: ['ai.openai.inference'] });
    assert(false, 'audience mismatch should throw');
  } catch (err) {
    assert(err.message === FAILURE_REASONS.AUDIENCE_MISMATCH, 'audience denied');
  }

  // Issuer mismatch
  try {
    consumeLease(lease.lease_id, { audience: 'app', issuer: 'other', scopes: ['ai.openai.inference'] });
    assert(false, 'issuer mismatch should throw');
  } catch (err) {
    assert(err.message === FAILURE_REASONS.ISSUER_MISMATCH, 'issuer denied');
  }

  // Scope insufficient
  try {
    consumeLease(lease.lease_id, { audience: 'app', issuer: 'codex-builder', scopes: ['ai.openai.embeddings'] });
    assert(false, 'scope insufficient should throw');
  } catch (err) {
    assert(err.message === FAILURE_REASONS.SCOPE_INSUFFICIENT, 'scope denied');
  }

  // Contract invalid
  const bad = writeLease({
    lease_id: `lease-bad-contract-${suffix}`,
    contract_id: 'unknown',
    scopes: ['ai.openai.inference'],
    issued_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 1000).toISOString(),
    revocable: true,
    status: 'active',
    hash_fingerprint: 'hash',
    issuer: 'codex-builder'
  });
  try {
    consumeLease(bad.lease_id, { audience: 'app', issuer: 'codex-builder', scopes: ['ai.openai.inference'] });
    assert(false, 'contract invalid should throw');
  } catch (err) {
    assert(err.message === FAILURE_REASONS.CONTRACT_INVALID, 'contract invalid denied');
  }

  console.log('ALL Phase 4 consumption tests passed');
}

run().catch(err => {
  console.error('Phase 4 test failure:', err.message);
  process.exit(1);
});
