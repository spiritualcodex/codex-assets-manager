#!/usr/bin/env node
// scripts/test-match-eligibility-fail.js
// Test fail-closed behavior

const assert = require('assert');
const { transformScanToEligibility } = require('../src/match/eligibility');
const { validateEligibility } = require('../src/match/ruleset');

async function testFailClosedBehavior() {
  console.log('=== TEST: Fail-Closed Behavior (Empty Squad) ===\n');

  // ScanReport with no providers (ambiguous or invalid scan)
  const badScanReport = {
    providers: [],
    runtime: 'unknown',
    requestedCapabilities: [],
    requiredSecrets: [],
    warnings: ['Ambiguous project structure'],
    filesScanned: []
  };

  const matchEligibility = transformScanToEligibility(badScanReport);
  const decision = validateEligibility(matchEligibility);

  console.log('MatchEligibility:', JSON.stringify(matchEligibility, null, 2));
  console.log('\nEligibility Decision:', JSON.stringify(decision, null, 2));

  // Assertions: should fail
  assert(decision.eligible === false, 'should NOT be eligible');
  assert(decision.errors.length > 0, 'should have errors');
  assert(decision.errors.some(e => e.includes('EMPTY_SQUAD')), 'should report empty squad');
  assert(decision.errors.some(e => e.includes('UNKNOWN_STADIUM')), 'should report unknown stadium');

  console.log('\n✅ FAIL_CLOSED_TEST_PASSED (correctly rejected)');
  process.exit(0);
}

testFailClosedBehavior().catch((err) => {
  console.error('TEST_FAILED:', err.message);
  process.exit(2);
});
