#!/usr/bin/env node
// scripts/test-match-eligibility.js

const assert = require('assert');
const { transformScanToEligibility } = require('../src/match/eligibility');
const { validateEligibility } = require('../src/match/ruleset');

async function testEligibilityFlow() {
  // Simulate a ScanReport (from Scan phase)
  const scanReport = {
    providers: ['openai'],
    runtime: 'frontend',
    requestedCapabilities: ['ai.openai.inference'],
    requiredSecrets: ['OPENAI_API_KEY'],
    warnings: [],
    filesScanned: ['package.json', 'src/main.js']
  };

  console.log('=== TEST: ScanReport → MatchEligibility → Validation ===\n');
  console.log('ScanReport:', JSON.stringify(scanReport, null, 2));

  // Transform
  const matchEligibility = transformScanToEligibility(scanReport);
  console.log('\nMatchEligibility:', JSON.stringify(matchEligibility, null, 2));

  // Validate
  const decision = validateEligibility(matchEligibility);
  console.log('\nEligibility Decision:', JSON.stringify(decision, null, 2));

  // Assertions
  assert(matchEligibility.squad.includes('openai'), 'squad should include openai');
  assert(matchEligibility.formations.includes('ai.openai.inference'), 'formations should include capability');
  assert(matchEligibility.clearance.includes('OPENAI_API_KEY'), 'clearance should include secret');
  assert(decision.eligible === true, 'should be eligible');
  assert(decision.errors.length === 0, 'should have no errors');

  console.log('\n✅ TEST_PASSED');
  process.exit(0);
}

testEligibilityFlow().catch((err) => {
  console.error('TEST_FAILED:', err.message);
  process.exit(2);
});
