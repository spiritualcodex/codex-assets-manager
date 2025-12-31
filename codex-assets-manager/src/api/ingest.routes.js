const express = require('express');
const { handleScanRequest } = require('../ingest/scan.controller');

const router = express.Router();

// GET /vault/ingest/{ingestId}/scan
router.get('/:ingestId/scan', async (req, res) => {
  try {
    const { ingestId } = req.params;
    // In a real implementation, workspacePath would come from an ingest session store
    // For now, use a placeholder or environment variable
    const workspacePath = process.env.INGEST_WORKSPACE_PATH || process.cwd();

    const result = await handleScanRequest(ingestId, workspacePath);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: err.message,
      code: err.code || 'INTERNAL_ERROR'
    });
  }
});

module.exports = router;
