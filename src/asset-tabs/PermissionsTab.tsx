import React from 'react';

// asset-permissions-container
export function PermissionsTab() {
  const roles = [
    { role: 'OWNER', entity: 'User_01', level: 'Full Control', active: true },
    { role: 'VIEWER', entity: 'Auditor_Bot', level: 'Read Only', active: true },
    { role: 'EXECUTOR', entity: 'Engine_Core', level: 'Invoke', active: true },
    { role: 'GUEST', entity: 'External_API', level: 'Deny', active: false },
  ];

  return (
    <div className="asset-permissions-container p-4 space-y-4 animate-in fade-in duration-500">

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Access Control List (ACL)</h3>
        <span className="text-[10px] text-slate-600 font-mono">Source: Vault Policy #8821</span>
      </div>

      <div className="space-y-2">
        {roles.map((r, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-all asset-permission-row">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${r.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div>
                <p className="text-xs font-bold text-slate-200">{r.entity}</p>
                <p className="text-[10px] text-slate-500 font-mono">{r.role}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-[10px] px-2 py-0.5 rounded border ${r.level === 'Deny'
                  ? 'bg-red-500/10 border-red-500/30 text-red-500'
                  : 'bg-slate-700/30 border-slate-600 text-slate-400'
                }`}>
                {r.level}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-white/5 mt-4">
        <p className="text-[10px] text-slate-600 text-center">
          🔒 Permissions are immutable from this view. Contact Admin to request changes.
        </p>
      </div>

    </div>
  );
}
