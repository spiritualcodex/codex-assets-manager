/**
 * EligibilityPanel — Read-Only Visualization of Eligibility Result Contract
 * 
 * Binds directly to: GET /vault/ingest/{ingestId}/eligibility/result
 * 
 * Displays:
 * - eligibility status (pass | fail)
 * - ruleset version
 * - rule hits (IDs + descriptions)
 * - explicit fail reasons
 * 
 * Rules:
 * - UI does NOT re-evaluate rules
 * - No green/red inference — only contract values
 * - HIDDEN if contract missing (not just locked; truly absent)
 * - Watermark: "VAR Check"
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const EligibilityPanel = ({ ingestId, apiBase = 'http://localhost:3000' }) => {
  const [contract, setContract] = useState(null);
  const [hash, setHash] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEligibilityResult();
  }, [ingestId]);

  const fetchEligibilityResult = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${apiBase}/vault/ingest/${ingestId}/eligibility/result`
      );
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('not-found');
        }
        throw new Error(`HTTP ${response.status}: Failed to fetch eligibility`);
      }
      const { data } = await response.json();
      setContract(data.contract);
      setHash(data.contractHash);
    } catch (err) {
      if (err.message === 'not-found') {
        setError('not-found');
      } else {
        setError(err.message);
      }
      setContract(null);
    } finally {
      setLoading(false);
    }
  };

  // If eligibility not found, panel is HIDDEN (not locked)
  if (error === 'not-found' && !loading) {
    return null;
  }

  if (loading) {
    return (
      <div className="panel eligibility-panel loading">
        <h2>🔍 Eligibility (VAR Check)</h2>
        <p>Loading eligibility contract...</p>
      </div>
    );
  }

  if (error) {
    // Other errors: show error but panel is still visible
    return (
      <div className="panel eligibility-panel error">
        <h2>🔍 Eligibility (VAR Check)</h2>
        <p className="error">⚠️ Error: {error}</p>
      </div>
    );
  }

  if (!contract) {
    return null;
  }

  return (
    <div className="panel eligibility-panel">
      <h2>🔍 Eligibility (VAR Check)</h2>

      <div className="contract-header">
        <div className="contract-meta">
          <span className="label">Status:</span>
          <span className={`status status-${contract.eligible ? 'pass' : 'fail'}`}>
            {contract.eligible ? '✅ PASS' : '❌ FAIL'}
          </span>
        </div>
        <div className="contract-meta">
          <span className="label">Ruleset Version:</span>
          <span className="value">{contract.rulesetVersion}</span>
        </div>
        <div className="contract-meta">
          <span className="label">Contract Version:</span>
          <span className="value">{contract.contractVersion}</span>
        </div>
        <div className="contract-meta">
          <span className="label">Hash:</span>
          <code className="hash">{hash}</code>
        </div>
      </div>

      {contract.eligible ? (
        <div className="eligibility-approved">
          <h3>✅ All Rules Passed</h3>
          <div className="rule-hits">
            {contract.ruleHits && contract.ruleHits.length > 0 && (
              <>
                <h4>Rules Applied:</h4>
                {contract.ruleHits.map((hit, idx) => (
                  <div key={idx} className="rule-hit">
                    <strong>{hit.id}</strong>: {hit.description}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="eligibility-rejected">
          <h3>❌ Eligibility Failed</h3>
          {contract.reasons && contract.reasons.length > 0 && (
            <div className="fail-reasons">
              <h4>Failure Reasons:</h4>
              {contract.reasons.map((reason, idx) => (
                <div key={idx} className="reason">
                  <span className="reason-code">{reason}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="panel-actions">
        <button className="btn-copy" onClick={() => copyToClipboard(contract)}>
          📋 Copy JSON
        </button>
        <button className="btn-export" onClick={() => exportAsJSON(contract, 'eligibility')}>
          💾 Export JSON
        </button>
      </div>
    </div>
  );
};

EligibilityPanel.propTypes = {
  ingestId: PropTypes.string.isRequired,
  apiBase: PropTypes.string
};

/**
 * Copy contract to clipboard.
 */
function copyToClipboard(contract) {
  const json = JSON.stringify(contract, null, 2);
  navigator.clipboard.writeText(json).then(() => {
    alert('✅ Contract copied to clipboard');
  });
}

/**
 * Export contract as JSON file.
 */
function exportAsJSON(contract, name) {
  const json = JSON.stringify(contract, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}-contract.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export default EligibilityPanel;
