import React, { useEffect, useState } from 'react';
import { fetchScanReport } from './adapters';

const ScanPanel = ({ ingestId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ingestId) {
      setData(null);
      return;
    }

    setLoading(true);
    fetchScanReport(ingestId)
      .then(report => {
        setData(report);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [ingestId]);

  if (!ingestId) return null; // Gating Rule
  if (loading) return <div className="panel-loading">Scanning...</div>;
  if (!data) return <div className="panel-empty">No Scan Report Found</div>;

  return (
    <div className="panel scan-panel">
      <h3>🔍 Scan Report</h3>
      <div className="panel-content">
        <div className="row">
          <span className="label">Providers:</span>
          <span className="value">{data.providers.join(', ')}</span>
        </div>
        <div className="row">
          <span className="label">Runtime:</span>
          <span className="value">{data.runtime}</span>
        </div>
        <div className="row">
          <span className="label">Integrity:</span>
          <span className="value mono">{data.integrity}</span>
        </div>
      </div>
    </div>
  );
};

export default ScanPanel;
