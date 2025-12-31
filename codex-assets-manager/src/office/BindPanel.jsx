/**
 * BindPanel — Read-Only Visualization of Bind Result Contract (Phase 3A)
 * 
 * Binds directly to: GET /vault/ingest/{ingestId}/bind/result
 * 
 * Displays:
 * - contract_id (ingestId)
 * - allowed (decision status)
 * - allowed_scopes (squad/formations)
 * - leases required (marked as pending_issuance, not issued)
 * - expiry window (if present)
 * - immutable flags
 * - signature placeholder (if unsigned)
 * 
 * Rules:
 * - No "issue", "approve", or "edit" buttons
 * - If unsigned → watermark: "PRE-ISSUANCE"
 * - LOCKED if contract missing
 * - No UI-side calculations
 * - Watermark: "Match Sheet"
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const BindPanel = ({ ingestId, apiBase = 'http://localhost:3000' }) => {
  const [contract, setContract] = useState(null);
  const [hash, setHash] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBindResult();
  }, [ingestId]);

  const fetchBindResult = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${apiBase}/vault/ingest/${ingestId}/bind/result`
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Bind contract not found`);
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
      <div className="panel bind-panel loading">
        <h2>📋 Bind (Match Sheet)</h2>
        <p>Loading bind contract...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel bind-panel locked">
        <h2>📋 Bind (Match Sheet)</h2>
        <p className="error">❌ LOCKED: {error}</p>
        <p className="note">Eligibility must pass before this panel is visible.</p>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="panel bind-panel locked">
        <h2>📋 Bind (Match Sheet)</h2>
        <p className="note">No bind contract available.</p>
      </div>
    );
  }

  const isUnsigned = !contract.signature;
  const isApproved = contract.allowed;

  return (
    <div className={`panel bind-panel ${isApproved ? 'approved' : 'rejected'}`}>
      <h2>📋 Bind (Match Sheet)</h2>

      {isUnsigned && (
        <div className="watermark pre-issuance">
          🔒 PRE-ISSUANCE (Unsigned Contract)
        </div>
      )}

      <div className="contract-header">
        <div className="contract-meta">
          <span className="label">Contract ID:</span>
          <span className="value">{ingestId}</span>
        </div>
        <div className="contract-meta">
          <span className="label">Decision:</span>
          <span className={`decision ${isApproved ? 'approved' : 'rejected'}`}>
            {isApproved ? '✅ ALLOWED' : '❌ REJECTED'}
          </span>
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

      <div className="contract-details">
        <h3>Allowed Scopes</h3>
        <div className="scopes">
          {contract.squad && contract.squad.length > 0 && (
            <div className="scope squad">
              <strong>Squad (Providers):</strong>
              <ul>
                {contract.squad.map((provider, idx) => (
                  <li key={idx}>{provider}</li>
                ))}
              </ul>
            </div>
          )}
          {contract.formations && contract.formations.length > 0 && (
            <div className="scope formations">
              <strong>Formations (Capabilities):</strong>
              <ul>
                {contract.formations.map((formation, idx) => (
                  <li key={idx}>{formation}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {isApproved && contract.leasesRequired && contract.leasesRequired.length > 0 && (
          <div className="leases">
            <h3>Required Leases (Phase 3B Pending)</h3>
            <div className="lease-list">
              {contract.leasesRequired.map((lease, idx) => (
                <div key={idx} className="lease">
                  <div className="lease-name">{lease.name}</div>
                  <div className="lease-status">
                    <span className="badge pending">{lease.status}</span>
                  </div>
                  <div className="lease-type">Type: {lease.type}</div>
                </div>
              ))}
            </div>
            <p className="note phase-note">
              ℹ️ These leases are marked <code>pending_issuance</code>.
              Secret issuance is deferred to Phase 3B.
            </p>
          </div>
        )}

        {contract.reasons && contract.reasons.length > 0 && (
          <div className="rejection-reasons">
            <h3>Rejection Reasons</h3>
            {contract.reasons.map((reason, idx) => (
              <div key={idx} className="reason">
                <span className="reason-code">{reason}</span>
              </div>
            ))}
          </div>
        )}

        {contract.expiryWindow && (
          <div className="expiry-window">
            <h3>Expiry Window</h3>
            <pre>{JSON.stringify(contract.expiryWindow, null, 2)}</pre>
          </div>
        )}

        {contract.immutableFlags && (
          <div className="immutable-flags">
            <h3>Immutable Flags</h3>
            <pre>{JSON.stringify(contract.immutableFlags, null, 2)}</pre>
          </div>
        )}
      </div>

      {isUnsigned && (
        <div className="signature-placeholder">
          <p>Signature: <code>UNSIGNED</code></p>
          <p className="note">This contract will be signed during Phase 3B secret issuance.</p>
        </div>
      )}

      <div className="panel-actions">
        <button className="btn-copy" onClick={() => copyToClipboard(contract)}>
          📋 Copy JSON
        </button>
        <button className="btn-export" onClick={() => exportAsJSON(contract, 'bind')}>
          💾 Export JSON
        </button>
      </div>

      <div className="panel-note">
        <p>
          <strong>Note:</strong> This is a read-only contract preview.
          No issuance, approval, or editing is performed in the Office UI.
          All binding decisions are made by the Vault.
        </p>
      </div>
    </div>
  );
};

BindPanel.propTypes = {
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

export default BindPanel;
