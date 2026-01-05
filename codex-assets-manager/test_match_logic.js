// test_match_logic.js
const { validateEligibility } = require('./src/match/ruleset.js');
const { transformScanToEligibility } = require('./src/match/eligibility.js');

console.log("⚽ Starting Autonomy Dry-Run: Match Eligibility Check");

// 1. Simulate Scan Report (Input)
const mockScanReport = {
    providers: ['Oracle', 'Sanctum'], // Squad
    requestedCapabilities: ['verify', 'sign'], // Formations
    requiredSecrets: ['API_KEY'], // Clearance
    runtime: 'cloud-v1', // Stadium Rules
    filesScanned: ['file1.js', 'file2.js']
};

console.log("📋 Input Scan Report:", JSON.stringify(mockScanReport));

// 2. Transform Logic
try {
    const eligibility = transformScanToEligibility(mockScanReport);
    console.log("🔄 Transformed Eligibility:", JSON.stringify(eligibility));

    // 3. Validation Logic (The Decision)
    const decision = validateEligibility(eligibility);

    if (decision.eligible) {
        console.log("✅ MATCH APPROVED: Decision Logic Valid");
        console.log("Events:", decision);
    } else {
        console.error("❌ MATCH REJECTED:", decision.errors);
        process.exit(1);
    }

} catch (e) {
    console.error("💥 Runtime Error:", e);
    process.exit(1);
}
