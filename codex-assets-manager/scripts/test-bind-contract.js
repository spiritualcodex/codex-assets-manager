#!/usr/bin/env node
// scripts/test-bind-contract.js

const assert = require('assert');
const { handleBindRequest } = require('../src/ingest/bind.controller');

async function testBindContractFlow() {
  console.log('=== TEST: MatchEligibility → BindDecision (Approved) ===\n');

  // Simulate an approved MatchEligibility
  const matchEligibility = {
    ingestId: 'ingest_abc123',
    eligible: true,
    squad: ['openai'],
    formations: ['ai.openai.inference'],
    clearance: ['OPENAI_API_KEY'],
    stadiumRules: 'frontend',
    inspectionScore: 2,
    errors: []
  };

  const result = await handleBindRequest('ingest_abc123', matchEligibility);

  console.log('BindDecision Result:', JSON.stringify(result, null, 2));

  // Assertions
  assert(result.status === 'approved_pending_secrets', 'status should be approved_pending_secrets');
  assert(result.decision.allowed === true, 'decision.allowed should be true');
  assert(result.decision.leasesRequired.length === 1, 'should require 1 lease');
  assert(result.decision.leasesRequired[0].name === 'OPENAI_API_KEY', 'lease should be for OPENAI_API_KEY');
  assert(result.decision.leasesRequired[0].status === 'pending_issuance', 'lease status should be pending_issuance');

  console.log('\n✅ BIND_APPROVED_TEST_PASSED');
  process.exit(0);
}

testBindContractFlow().catch((err) => {
  console.error('TEST_FAILED:', err.message);
  process.exit(2);
});
