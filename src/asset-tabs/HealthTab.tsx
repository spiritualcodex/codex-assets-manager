import React from 'react';

// asset-health-container
export function HealthTab() {
  const checks = [
    { label: 'Signature Verification', status: 'PASS' },
    { label: 'Runtime Integrity', status: 'PASS' },
    { label: 'Dependency Audit', status: 'WARN' },
    { label: 'Resource Quotas', status: 'PASS' },
  ];

  return (
    <div className="asset-health-container p-4 space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">System Health</h3>
        <span className="text-[10px] text-slate-500 font-mono">Last Scan: Just now</span>
      </div>

      {/* Main Status Banner */}
      <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-lg flex items-center gap-6">
        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-black text-2xl shadow-[0_0_20px_rgba(34,197,94,0.4)]">
          ✓
        </div>
        <div>
          <h2 className="text-xl font-black text-green-400 uppercase tracking-tighter">Match Fit</h2>
          <p className="text-xs text-green-500/70 uppercase tracking-widest">All systems nominal</p>
        </div>
      </div>

      {/* Checks Grid */}
      <div className="grid grid-cols-2 gap-3">
        {checks.map((check, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded">
            <span className="text-xs text-slate-400">{check.label}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${check.status === 'PASS' ? 'bg-green-500/20 text-green-400' :
                check.status === 'WARN' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
              }`}>
              {check.status}
            </span>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <p className="text-[10px] text-slate-600 italic">
          Asset is cleared for execution in Phase 5.
        </p>
      </div>

    </div>
  );
}
