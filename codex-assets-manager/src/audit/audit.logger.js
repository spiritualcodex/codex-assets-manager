const fs = require('fs');
const path = require('path');

const AUDIT_DIR = path.join(__dirname, '..', '..', 'data');
const AUDIT_FILE = path.join(AUDIT_DIR, 'audit.log');

function ensureAuditPath() {
  try {
    if (!fs.existsSync(AUDIT_DIR)) fs.mkdirSync(AUDIT_DIR, { recursive: true });
    if (!fs.existsSync(AUDIT_FILE)) fs.writeFileSync(AUDIT_FILE, '');
  } catch (e) {
    // swallow — best-effort audit
  }
}

function appendAudit(eventObj) {
  try {
    ensureAuditPath();
    const line = JSON.stringify(Object.assign({ id: Date.now().toString(36) }, eventObj));
    fs.appendFileSync(AUDIT_FILE, line + '\n', { encoding: 'utf8' });
  } catch (e) {
    // Do not throw from audit to avoid masking original errors
    console.error('audit append failed', e && e.message);
  }
}

module.exports = { appendAudit };
