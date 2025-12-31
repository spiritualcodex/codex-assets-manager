/**
 * OfficeUI — Main Page Container
 * 
 * Composition:
 * 1. ScanPanel (Scan result contract)
 * 2. EligibilityPanel (Eligibility result contract)
 * 3. BindPanel (Bind decision contract)
 * 
 * All panels are:
 * - Read-only (no mutation)
 * - Contract-bound (render only from API contracts)
 * - Fail-closed (missing contracts = locked/hidden)
 * - Zero-logic (no UI-side calculations)
 * 
 * No buttons except:
 * - Copy JSON
 * - Export JSON
 * 
 * No control plane actions. This is a glass wall.
 */

import React, { useState } from 'react';
import ScanPanel from './ScanPanel';
import EligibilityPanel from './EligibilityPanel';
import BindPanel from './BindPanel';
import './OfficeUI.css';

export const OfficeUI = ({ apiBase = 'http://localhost:3000' }) => {
  const [ingestId, setIngestId] = useState('');
  const [activeIngest, setActiveIngest] = useState(null);

  const handleStartIngest = (e) => {
    e.preventDefault();
    if (ingestId.trim()) {
      setActiveIngest(ingestId.trim());
    }
  };

  return (
    <div className="office-ui">
      <header className="office-header">
        <div className="header-content">
          <h1>🏛️ Codex Office</h1>
          <p className="subtitle">Read-Only Contract Viewer</p>
        </div>
      </header>

      {!activeIngest ? (
        <div className="ingest-selector">
          <div className="selector-card">
            <h2>Start Viewing Ingest</h2>
            <form onSubmit={handleStartIngest}>
              <label htmlFor="ingestId">Ingest ID:</label>
              <input
                id="ingestId"
                type="text"
                placeholder="e.g., abc123"
                value={ingestId}
                onChange={(e) => setIngestId(e.target.value)}
                required
              />
              <button type="submit">View Contracts</button>
            </form>
            <p className="note">
              Enter an ingest ID to view its Scan, Eligibility, and Bind contracts.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="ingest-controls">
            <span className="active-ingest">Ingest: <code>{activeIngest}</code></span>
            <button
              className="btn-back"
              onClick={() => {
                setActiveIngest(null);
                setIngestId('');
              }}
            >
              ← Back
            </button>
          </div>

          <div className="panels-container">
            <ScanPanel ingestId={activeIngest} apiBase={apiBase} />
            <EligibilityPanel ingestId={activeIngest} apiBase={apiBase} />
            <BindPanel ingestId={activeIngest} apiBase={apiBase} />
          </div>

          <footer className="office-footer">
            <p>
              🔒 <strong>Read-Only Access.</strong> All data from immutable API contracts.
              No UI-side business logic. No mutations.
            </p>
            <p>
              ℹ️ Missing panels indicate prerequisites not yet completed.
              Eligibility requires Scan. Bind requires Eligibility.
            </p>
          </footer>
        </>
      )}
    </div>
  );
};

export default OfficeUI;
