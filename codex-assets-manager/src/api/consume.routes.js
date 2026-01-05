const express = require('express');
const router = express.Router();
const { consumeLease } = require('../consume/lease.consume');

// POST /vault/lease/:leaseId/consume
router.post('/lease/:leaseId/consume', (req, res) => {
  try {
    const { leaseId } = req.params;
    const body = req.body || {};
    const audience = req.headers['x-audience'] || body.audience;
    const issuer = req.headers['x-issuer'] || body.issuer;
    const scopes = body.scopes;
    const consumer_id = req.headers['x-consumer'] || body.consumer_id;

    const result = consumeLease(leaseId, { audience, issuer, scopes, consumer_id });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(403).json({ success: false, error: err.message });
  }
});

module.exports = router;
