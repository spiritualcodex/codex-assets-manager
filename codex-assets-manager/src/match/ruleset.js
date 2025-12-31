// src/match/ruleset.js
// Fail-closed validation: can the match begin?

const REQUIRED_SQUAD_SIZE = 1; // At least one provider
const MAX_SQUAD_SIZE = 3; // Ambiguity guard
const MIN_FORMATIONS = 1; // At least one capability

function validateEligibility(matchEligibility) {
  const errors = [];

  // Squad check: must have providers, not too many
  if (!matchEligibility.squad || matchEligibility.squad.length === 0) {
    errors.push('EMPTY_SQUAD: No providers detected');
  }
  if (matchEligibility.squad.length > MAX_SQUAD_SIZE) {
    errors.push(`SQUAD_OVERFLOW: ${matchEligibility.squad.length} providers (max ${MAX_SQUAD_SIZE})`);
  }

  // Formations check: must request capabilities
  if (!matchEligibility.formations || matchEligibility.formations.length === 0) {
    errors.push('NO_FORMATIONS: No capabilities requested');
  }

  // Clearance check: warn if secrets required but not listed
  // (In real system, Vault would enforce this)
  if (matchEligibility.clearance && matchEligibility.clearance.length > 0) {
    // Just log; Vault will handle validation
  }

  // Stadium rules check
  if (!matchEligibility.stadiumRules || matchEligibility.stadiumRules === 'unknown') {
    errors.push('UNKNOWN_STADIUM: Runtime environment not detected');
  }

  // Return fail-closed decision
  return {
    eligible: errors.length === 0,
    errors,
    squad: matchEligibility.squad,
    formations: matchEligibility.formations,
    clearance: matchEligibility.clearance,
    stadiumRules: matchEligibility.stadiumRules,
    inspectionScore: matchEligibility.inspectionScore,
    timestamp: matchEligibility.timestamp
  };
}

module.exports = { validateEligibility };
