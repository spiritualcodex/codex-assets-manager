#!/usr/bin/env node
const assert = require('assert');
const path = require('path');
const { scanProject } = require('../src/ingest/scan');

async function run() {
  const fixture = path.join(__dirname, '..', 'test-fixtures', 'simple-project');
  try {
    const report = await scanProject(fixture);
    console.log('Report:', report);

    // Basic assertions
    assert(Array.isArray(report.providers), 'providers must be an array');
    assert(report.providers.includes('openai'), 'should detect openai provider');
    assert(Array.isArray(report.requestedCapabilities), 'requestedCapabilities must be an array');
    assert(report.requestedCapabilities.includes('ai.openai.inference'), 'should map openai -> ai.openai.inference');
    assert(Array.isArray(report.requiredSecrets), 'requiredSecrets must be an array');
    // secret names detection: OPENAI_API_KEY
    const upperSecrets = report.requiredSecrets.map(s => s.toUpperCase());
    assert(upperSecrets.includes('OPENAI_API_KEY') || upperSecrets.includes('OPENAI_API_KEY'), 'should detect OPENAI_API_KEY');

    console.log('TEST_OK');
    process.exit(0);
  } catch (err) {
    console.error('TEST_FAIL', err && err.message);
    process.exit(2);
  }
}

run();
