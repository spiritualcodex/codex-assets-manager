/**
 * Results Contract Routes
 * 
 * Exposes immutable result contracts from:
 * - Scan phase (raw findings)
 * - Eligibility phase (rule verdict)
 * - Bind phase (contract preview)
 * 
 * These are read-only, fail-closed endpoints.
 * No business logic; pure contract retrieval.
 * 
 * All results are audit-logged by their source handlers.
 */

const express = require('express');
const crypto = require('crypto');

const router = express.Router();

/**
 * In-memory store for ingest results.
 * In production: replace with persistent store (Redis, DB).
 * Key: ingestId
 * Value: { scan, eligibility, bind }
 */
const ingestResults = new Map();

/**
 * Register a scan result for an ingest.
 * Called by scan.controller after successful scan.
 */
function registerScanResult(ingestId, scanReport) {
  if (!ingestResults.has(ingestId)) {
    ingestResults.set(ingestId, {});
  }
  const entry = ingestResults.get(ingestId);
  entry.scan = {
    ...scanReport,
    contractVersion: '1.0',
    registeredAt: new Date().toISOString()
  };
  return entry;
}

/**
 * Register an eligibility result for an ingest.
 * Called by eligibility controller after validation.
 */
function registerEligibilityResult(ingestId, eligibilityReport) {
  if (!ingestResults.has(ingestId)) {
    ingestResults.set(ingestId, {});
  }
  const entry = ingestResults.get(ingestId);
  entry.eligibility = {
    ...eligibilityReport,
    contractVersion: '1.0',
    registeredAt: new Date().toISOString()
  };
  return entry;
}

/**
 * Register a bind result for an ingest.
 * Called by bind.controller after decision.
 */
function registerBindResult(ingestId, bindDecision) {
  if (!ingestResults.has(ingestId)) {
    ingestResults.set(ingestId, {});
  }
  const entry = ingestResults.get(ingestId);
  entry.bind = {
    ...bindDecision,
    contractVersion: '3a',
    registeredAt: new Date().toISOString()
  };
  return entry;
}

/**
 * Compute SHA256 hash of a contract for integrity checking.
 */
function hashContract(contract) {
  const json = JSON.stringify(contract, null, 0);
  return crypto.createHash('sha256').update(json).digest('hex');
}

/**
 * GET /vault/ingest/{ingestId}/scan/result
 * 
 * Retrieve the immutable scan result contract.
 * Fail-closed: missing → 404
 */
router.get('/:ingestId/scan/result', (req, res) => {
  const { ingestId } = req.params;
  const entry = ingestResults.get(ingestId);

  if (!entry || !entry.scan) {
    return res.status(404).json({
      success: false,
      error: 'Scan result not found or not yet completed',
      code: 'SCAN_NOT_FOUND',
      ingestId
    });
  }

  const contract = entry.scan;
  const hash = hashContract(contract);

  res.status(200).json({
    success: true,
    data: {
      ingestId,
      contract,
      contractHash: hash,
      retrievedAt: new Date().toISOString()
    }
  });
});

/**
 * GET /vault/ingest/{ingestId}/eligibility/result
 * 
 * Retrieve the immutable eligibility result contract.
 * Fail-closed: missing or scan not complete → 404 or 412
 */
router.get('/:ingestId/eligibility/result', (req, res) => {
  const { ingestId } = req.params;
  const entry = ingestResults.get(ingestId);

  if (!entry || !entry.scan) {
    return res.status(412).json({
      success: false,
      error: 'Scan phase must complete first',
      code: 'PRECONDITION_FAILED',
      ingestId
    });
  }

  if (!entry.eligibility) {
    return res.status(404).json({
      success: false,
      error: 'Eligibility result not found or not yet evaluated',
      code: 'ELIGIBILITY_NOT_FOUND',
      ingestId
    });
  }

  const contract = entry.eligibility;
  const hash = hashContract(contract);

  res.status(200).json({
    success: true,
    data: {
      ingestId,
      contract,
      contractHash: hash,
      retrievedAt: new Date().toISOString()
    }
  });
});

/**
 * GET /vault/ingest/{ingestId}/bind/result
 * 
 * Retrieve the immutable bind result contract (Phase 3A: decision only, no secrets).
 * Fail-closed: missing or eligibility not complete → 404 or 412
 */
router.get('/:ingestId/bind/result', (req, res) => {
  const { ingestId } = req.params;
  const entry = ingestResults.get(ingestId);

  if (!entry || !entry.eligibility) {
    return res.status(412).json({
      success: false,
      error: 'Eligibility phase must complete first',
      code: 'PRECONDITION_FAILED',
      ingestId
    });
  }

  if (!entry.bind) {
    return res.status(404).json({
      success: false,
      error: 'Bind result not found or not yet decided',
      code: 'BIND_NOT_FOUND',
      ingestId
    });
  }

  const contract = entry.bind;
  const hash = hashContract(contract);

  res.status(200).json({
    success: true,
    data: {
      ingestId,
      contract,
      contractHash: hash,
      retrievedAt: new Date().toISOString()
    }
  });
});

/**
 * Export: register functions for controllers to call
 */
module.exports = router;
module.exports.registerScanResult = registerScanResult;
module.exports.registerEligibilityResult = registerEligibilityResult;
module.exports.registerBindResult = registerBindResult;
module.exports.hashContract = hashContract;
