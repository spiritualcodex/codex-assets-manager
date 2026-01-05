import React, { useEffect, useState } from 'react';
import { fetchEligibility } from './adapters';

const EligibilityPanel = ({ ingestId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ingestId) { setData(null); return; }
    setLoading(true);
    fetchEligibility(ingestId)
      .then(res => { setData(res); setLoading(false); })
      .catch(() => { setData(null); setLoading(false); });
  }, [ingestId]);

  if (!ingestId || !data) return null;

  return (
    <div className={`panel eligibility-panel ${data.allowed ? 'allowed' : 'blocked'}`}>
      <h3>⚖️ Eligibility</h3>
      <div className="panel-content">
        <div className="status-badge">
          {data.allowed ? '✅ ELIGIBLE' : '❌ INELIGIBLE'}
        </div>
        <ul className="reasons-list">
          {data.reasons.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
        <div className="timestamp">{data.timestamp}</div>
      </div>
    </div>
  );
};

export default EligibilityPanel;
