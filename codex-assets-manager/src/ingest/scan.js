const fs = require('fs');
const path = require('path');
const { appendAudit } = require('../audit/audit.logger');

const PROVIDER_KEYWORDS = {
  gemini: ['gemini'],
  openai: ['openai', 'openai-api'],
  huggingface: ['huggingface', 'transformers', 'hf'],
  azure: ['azure', 'azureai', 'azureml'],
  aws: ['aws', 'amazonaws', 'boto3'],
  gcp: ['gcp', 'google', 'google-cloud', 'gcloud']
};

const CAPABILITY_MAP = {
  openai: ['ai.openai.inference'],
  gemini: ['ai.gemini.inference'],
  huggingface: ['ai.huggingface.inference']
};

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return null;
  }
}

function listFilesRecursive(root) {
  const results = [];
  const stack = [root];
  while (stack.length) {
    const cur = stack.pop();
    const stat = fs.statSync(cur);
    if (stat.isDirectory()) {
      const entries = fs.readdirSync(cur);
      for (const e of entries) stack.push(path.join(cur, e));
    } else if (stat.isFile()) {
      results.push(cur);
    }
  }
  return results;
}

function detectProvidersFromText(text) {
  const found = new Set();
  if (!text) return found;
  const lower = text.toLowerCase();
  for (const [provider, keys] of Object.entries(PROVIDER_KEYWORDS)) {
    for (const k of keys) if (lower.includes(k)) found.add(provider);
  }
  return found;
}

function detectEnvKeysFromText(text) {
  if (!text) return [];
  const res = new Set();
  // process.env.VAR or process.env['VAR'] or ${VAR}
  const re1 = /process\.env\.([A-Z0-9_]+)/g;
  const re2 = /process\.env\[['\"]([A-Z0-9_]+)['\"]\]/g;
  const re3 = /\$\{?([A-Z0-9_]+)\}?/g;
  let m;
  while ((m = re1.exec(text))) res.add(m[1]);
  while ((m = re2.exec(text))) res.add(m[1]);
  // re3 is noisy; only accept common secret-like names
  while ((m = re3.exec(text))) {
    const name = m[1];
    if (/KEY|TOKEN|SECRET|API|PASSWORD|PWD/i.test(name)) res.add(name);
  }
  return Array.from(res);
}

async function scanProject(rootPath) {
  const start = new Date().toISOString();
  const files = listFilesRecursive(rootPath).filter(f => !f.includes('node_modules') && !f.includes('.git'));
  const filesScanned = files.map(f => path.relative(rootPath, f));

  const allText = files.map(f => readFileSafe(f)).filter(Boolean).join('\n');

  const detectedProviders = Array.from(detectProvidersFromText(allText));

  // Fail closed on conflicting provider signals (e.g., multiple distinct primary providers)
  const providerConflicts = detectedProviders.filter(p => ['openai','gemini','huggingface'].includes(p));
  if (providerConflicts.length > 1) {
    const ev = {
      event: 'ingest.scan.failed',
      reason: 'provider_conflict',
      providers: detectedProviders,
      root: rootPath,
      timestamp: start
    };
    appendAudit(ev);
    const err = new Error('Ambiguous providers detected: ' + providerConflicts.join(', '));
    err.code = 'AMBIGUOUS_PROVIDERS';
    throw err;
  }

  // Determine runtime (simple heuristics)
  let runtime = 'unknown';
  if (allText.includes('react') || allText.includes('vite') || allText.includes('next')) runtime = 'frontend';
  if (allText.includes('express') || allText.includes('koa') || allText.includes('fastify')) runtime = runtime === 'frontend' ? 'hybrid' : 'backend';

  // Capabilities
  const capabilities = new Set();
  for (const p of detectedProviders) {
    if (CAPABILITY_MAP[p]) CAPABILITY_MAP[p].forEach(c => capabilities.add(c));
  }

  // Secrets detection (names only)
  const requiredSecrets = new Set();
  for (const f of files) {
    const txt = readFileSafe(f);
    if (!txt) continue;
    for (const k of detectEnvKeysFromText(txt)) requiredSecrets.add(k);
  }

  const report = {
    providers: detectedProviders,
    runtime,
    requestedCapabilities: Array.from(capabilities),
    requiredSecrets: Array.from(requiredSecrets),
    warnings: [],
    filesScanned
  };

  // audit
  appendAudit({ event: 'ingest.scan.completed', root: rootPath, report, timestamp: start });

  return report;
}

module.exports = { scanProject };
