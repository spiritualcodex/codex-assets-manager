const express = require('express');
const router = express.Router();
const leaseController = require('../secrets/lease.controller');
const leaseModel = require('../secrets/lease.model');

// POST /vault/ingest/:ingestId/lease
router.post('/:ingestId/lease', async (req, res) => {
  try {
    const { ingestId } = req.params;
    const body = req.body || {};
    const issuer = req.headers['x-requester'];
    if (!issuer) {
      return res.status(400).json({ success: false, error: 'ISSUER_REQUIRED' });
    }
    const lease = await leaseController.issueLeaseForIngest(ingestId, body, issuer);
    res.status(201).json({ success: true, data: lease });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /vault/lease/:leaseId/revoke
router.post('/lease/:leaseId/revoke', async (req, res) => {
  try {
    const { leaseId } = req.params;
    const actor = req.headers['x-requester'];
    if (!actor) {
      return res.status(400).json({ success: false, error: 'ISSUER_REQUIRED' });
    }
    const updated = await leaseController.revokeLease(leaseId, actor);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /vault/ingest/:ingestId/leases
router.get('/:ingestId/leases', (req, res) => {
  try {
    const { ingestId } = req.params;
    // map ingestId -> contractId: results.routes uses contract_id or ingestId
    const leases = leaseModel.listLeasesByContract(ingestId);
    res.status(200).json({ success: true, data: leases });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
