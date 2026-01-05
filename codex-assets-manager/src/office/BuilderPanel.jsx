// codex-assets-manager/src/office/BuilderPanel.jsx
import React, { useState } from 'react';
import { TestRunner } from '../builder/test-runner.service';

const BuilderPanel = () => {
    const [logs, setLogs] = useState([]);
    const [status, setStatus] = useState('IDLE');
    const [selectedScenario, setSelectedScenario] = useState('FULL_SYSTEM_DRY_RUN');

    const runTest = async () => {
        setStatus('RUNNING');
        setLogs(['Initializing Test Environment...']);

        try {
            const result = await TestRunner.runTest(selectedScenario);
            setLogs(result.logs);
            setStatus(result.status);
        } catch (e) {
            setLogs(prev => [...prev, `CRITICAL ERROR: ${e.message}`]);
            setStatus('FAIL');
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#1e1e1e', color: '#00ff41', fontFamily: 'monospace', borderRadius: '8px', border: '1px solid #333' }}>
            <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>🛠 CODEX BUILDER</h2>

            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <select
                    value={selectedScenario}
                    onChange={(e) => setSelectedScenario(e.target.value)}
                    style={{ padding: '8px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '4px' }}
                >
                    <option value="FULL_SYSTEM_DRY_RUN">Full System Dry Run</option>
                    <option value="VALIDATE_GATES">Validate Gate Security</option>
                    <option value="CHECK_ENTITLEMENTS">Check SKU Entitlements</option>
                    <option value="SIMULATE_SCHEDULER">Simulate Scheduler Loop</option>
                </select>

                <button
                    onClick={runTest}
                    disabled={status === 'RUNNING'}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: status === 'RUNNING' ? '#555' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: status === 'RUNNING' ? 'not-allowed' : 'pointer'
                    }}
                >
                    {status === 'RUNNING' ? 'Running...' : '▶ RUN TEST'}
                </button>

                <span style={{
                    padding: '8px 16px',
                    borderRadius: '4px',
                    backgroundColor: status === 'PASS' ? '#28a745' : status === 'FAIL' ? '#dc3545' : '#444',
                    color: '#fff',
                    fontWeight: 'bold'
                }}>
                    {status}
                </span>
            </div>

            <div style={{
                height: '300px',
                overflowY: 'scroll',
                backgroundColor: '#000',
                padding: '10px',
                borderRadius: '4px',
                fontSize: '12px',
                whiteSpace: 'pre-wrap'
            }}>
                {logs.length === 0 ? <span style={{ color: '#666' }}>Ready to build...</span> : logs.map((log, i) => (
                    <div key={i} style={{ color: log.includes('[ERROR]') ? 'red' : log.includes('[WARN]') ? 'orange' : '#00ff41' }}>
                        {log}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BuilderPanel;
