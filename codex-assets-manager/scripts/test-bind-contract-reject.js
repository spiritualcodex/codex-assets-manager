#!/usr/bin/env node
// scripts/test-bind-contract-reject.js

const assert = require('assert');
const { handleBindRequest } = require('../src/ingest/bind.controller');

async function testBindRejectFlow() {
  console.log('=== TEST: MatchEligibility → BindDecision (Rejected) ===\n');

  // Simulate a rejected MatchEligibility
  const matchEligibility = {
    ingestId: 'ingest_bad123',
    eligible: false,
    squad: [],
    formations: [],
    clearance: [],
    stadiumRules: 'unknown',
    inspectionScore: 0,
    errors: ['EMPTY_SQUAD: No providers detected', 'UNKNOWN_STADIUM: Runtime not detected']
  };

  const result = await handleBindRequest('ingest_bad123', matchEligibility);

  console.log('BindDecision Result:', JSON.stringify(result, null, 2));

  // Assertions
  assert(result.status === 'rejected', 'status should be rejected');
  assert(result.decision.allowed === false, 'decision.allowed should be false');
  assert(result.decision.reasons.length > 0, 'should include rejection reasons');
  assert(result.decision.leasesRequired.length === 0, 'should require no leases');

  console.log('\n✅ BIND_REJECTED_TEST_PASSED (correctly blocked)');
  process.exit(0);
}

testBindRejectFlow().catch((err) => {
  console.error('TEST_FAILED:', err.message);
  process.exit(2);
});
