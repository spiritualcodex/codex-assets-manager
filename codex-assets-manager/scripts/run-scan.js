#!/usr/bin/env node
const path = require('path');
const { scanProject } = require('../src/ingest/scan');

async function main() {
  const target = process.argv[2] || path.join(__dirname, '..', '..');
  try {
    const report = await scanProject(target);
    console.log('SCAN_REPORT:');
    console.log(JSON.stringify(report, null, 2));
    process.exit(0);
  } catch (e) {
    console.error('Scan failed:', e.message);
    process.exit(2);
  }
}

main();
