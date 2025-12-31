const { scanProject } = require('./scan');
const { appendAudit } = require('../audit/audit.logger');

async function handleScanRequest(ingestId, workspacePath) {
  const requestId = `scan_${ingestId}_${Date.now()}`;
  
  try {
    // Validate inputs
    if (!ingestId || typeof ingestId !== 'string') {
      const err = new Error('Invalid ingestId');
      err.code = 'BAD_REQUEST';
      throw err;
    }
    if (!workspacePath || typeof workspacePath !== 'string') {
      const err = new Error('Invalid workspacePath');
      err.code = 'BAD_REQUEST';
      throw err;
    }

    // Call scan engine
    const scanReport = await scanProject(workspacePath);

    // Audit success
    appendAudit({
      event: 'vault.ingest.scan.requested',
      ingestId,
      requestId,
      result: 'success',
      providers: scanReport.providers,
      timestamp: new Date().toISOString()
    });

    return {
      ingestId,
      requestId,
      status: 'success',
      report: scanReport
    };
  } catch (err) {
    // Fail closed: return error with no partial data
    const errCode = err.code || 'SCAN_FAILED';
    
    appendAudit({
      event: 'vault.ingest.scan.failed',
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

module.exports = { handleScanRequest };
