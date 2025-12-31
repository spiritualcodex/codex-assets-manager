/**
 * ScanPanel — Read-Only Visualization of Scan Result Contract
 * 
 * Binds directly to: GET /vault/ingest/{ingestId}/scan/result
 * 
 * Displays:
 * - asset_id (ingestId)
 * - contract version + hash
 * - scan timestamp
 * - raw findings (verbatim, unfiltered)
 * 
 * Rules:
 * - No derived fields
 * - No filtering or sorting
 * - LOCKED state if contract missing
 * - Watermark: "Football Kickoff"
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const ScanPanel = ({ ingestId, apiBase = 'http://localhost:3000' }) => {
  const [contract, setContract] = useState(null);
  const [hash, setHash] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchScanResult();
  }, [ingestId]);

  const fetchScanResult = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${apiBase}/vault/ingest/${ingestId}/scan/result`
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Scan result not found`);
      }
      const { data } = await response.json();
      setContract(data.contract);
      setHash(data.contractHash);
    } catch (err) {
      setError(err.message);
      setContract(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="panel scan-panel loading">
        <h2>🎯 Scan (Match Kickoff)</h2>
        <p>Loading scan contract...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel scan-panel locked">
        <h2>🎯 Scan (Match Kickoff)</h2>
        <p className="error">❌ LOCKED: {error}</p>
        <p className="note">Scan must complete before this panel is visible.</p>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="panel scan-panel locked">
        <h2>🎯 Scan (Match Kickoff)</h2>
        <p className="note">No scan data available.</p>
      </div>
    );
  }

  return (
    <div className="panel scan-panel">
      <h2>🎯 Scan (Match Kickoff)</h2>
      
      <div className="contract-header">
        <div className="contract-meta">
          <span className="label">Asset ID:</span>
          <span className="value">{ingestId}</span>
        </div>
        <div className="contract-meta">
          <span className="label">Contract Version:</span>
          <span className="value">{contract.contractVersion}</span>
        </div>
        <div className="contract-meta">
          <span className="label">Hash:</span>
          <code className="hash">{hash}</code>
        </div>
        <div className="contract-meta">
          <span className="label">Scanned At:</span>
          <span className="value">{new Date(contract.registeredAt).toISOString()}</span>
        </div>
      </div>

      <div className="raw-findings">
        <h3>Raw Findings (Verbatim)</h3>
        <div className="finding">
          <strong>Providers:</strong>
          <pre>{JSON.stringify(contract.providers, null, 2)}</pre>
        </div>
        <div className="finding">
          <strong>Runtime:</strong>
          <pre>{contract.runtime}</pre>
        </div>
        <div className="finding">
          <strong>Requested Capabilities:</strong>
          <pre>{JSON.stringify(contract.requestedCapabilities, null, 2)}</pre>
        </div>
        <div className="finding">
          <strong>Required Secrets (Names Only):</strong>
          <pre>{JSON.stringify(contract.requiredSecrets, null, 2)}</pre>
        </div>
        <div className="finding">
          <strong>Files Scanned:</strong>
          <pre>{JSON.stringify(contract.filesScanned, null, 2)}</pre>
        </div>
        {contract.warnings && contract.warnings.length > 0 && (
          <div className="finding warnings">
            <strong>Warnings:</strong>
            <pre>{JSON.stringify(contract.warnings, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="panel-actions">
        <button className="btn-copy" onClick={() => copyToClipboard(contract)}>
          📋 Copy JSON
        </button>
        <button className="btn-export" onClick={() => exportAsJSON(contract, 'scan')}>
          💾 Export JSON
        </button>
      </div>
    </div>
  );
};

ScanPanel.propTypes = {
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

export default ScanPanel;
