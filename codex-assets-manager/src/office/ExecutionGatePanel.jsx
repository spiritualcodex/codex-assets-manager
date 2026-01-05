import React, { useEffect, useState } from 'react';
import { issueExecutionGate } from '../execution/execution-gate.service';

const ExecutionGatePanel = ({ ingestId }) => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!ingestId) { setToken(null); return; }

        setLoading(true);
        // Office pretends to be a viewer to get the status
        issueExecutionGate(ingestId, 'Office-Viewer')
            .then(t => { setToken(t); setLoading(false); })
            .catch(() => { setToken(null); setLoading(false); });
    }, [ingestId]);

    if (!ingestId) return null;
    if (loading) return <div className="panel execution-gate-panel loading">Checking Gate...</div>;
    if (!token) return <div className="panel execution-gate-panel error">Gate Unreachable</div>;

    const { allowed, expiresAt, signature, reason } = token.decision;
    const timeLeft = expiresAt ? Math.max(0, expiresAt - Math.floor(Date.now() / 1000)) : 0;

    return (
        <div className={`panel execution-gate-panel ${allowed ? 'go' : 'no-go'}`}>
            <h3>🚦 Execution Gate (Referee)</h3>
            <div className="gate-display">
                {allowed ? (
                    <div className="signal green">
                        <span className="icon">🟢</span>
                        <div className="details">
                            <span className="title">MATCH AUTHORIZED</span>
                            <span className="ttl">Whistle Active: {timeLeft}s remaining</span>
                            <code className="sig">SIG: {signature}</code>
                        </div>
                    </div>
                ) : (
                    <div className="signal red">
                        <span className="icon">🔴</span>
                        <div className="details">
                            <span className="title">MATCH LOCKED</span>
                            <span className="reason">{reason || 'Denied'}</span>
                        </div>
                    </div>
                )}
                <div className="audit-id mono">{token.auditId}</div>
            </div>
        </div>
    );
};

export default ExecutionGatePanel;
