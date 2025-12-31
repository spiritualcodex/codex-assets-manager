// src/match/eligibility.js
// Pure transform: ScanReport -> MatchEligibility
// No side effects. No persistence. No logic decisions.

function transformScanToEligibility(scanReport) {
  if (!scanReport) {
    throw new Error('scanReport required');
  }

  return {
    squad: scanReport.providers || [],
    formations: scanReport.requestedCapabilities || [],
    clearance: scanReport.requiredSecrets || [],
    stadiumRules: scanReport.runtime || 'unknown',
    inspectionScore: scanReport.filesScanned ? scanReport.filesScanned.length : 0,
    warnings: scanReport.warnings || [],
    timestamp: new Date().toISOString()
  };
}

module.exports = { transformScanToEligibility };
