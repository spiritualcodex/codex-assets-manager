import React, { useEffect, useState } from 'react';
import { fetchBindPreview } from './adapters';

const BindPanel = ({ ingestId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!ingestId) { setData(null); return; }
    fetchBindPreview(ingestId).then(setData).catch(() => setData(null));
  }, [ingestId]);

  if (!ingestId || !data) return null;

  return (
    <div className="panel bind-panel">
      <h3>🔗 Bind Preview</h3>
      <div className="panel-content">
        <div className="kv-grid">
          <div>
            <span className="k">Lease ID</span>
            <span className="v mono">{data.leaseId}</span>
          </div>
          <div>
            <span className="k">TTL</span>
            <span className="v">{data.ttl}s</span>
          </div>
          <div>
            <span className="k">Scope</span>
            <span className="v">{data.scope}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BindPanel;
