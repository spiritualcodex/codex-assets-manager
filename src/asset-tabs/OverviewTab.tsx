import React from 'react';

// asset-overview-container
export function OverviewTab({ assetId = 'UNKNOWN' }: { assetId?: string }) {
  return (
    <div className="asset-overview-container p-4 space-y-6 animate-in fade-in duration-500">

      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-200">Asset Overview</h3>
          <p className="text-xs text-slate-500 font-mono">ID: {assetId}</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
          Vault Sync: Active
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 p-3 rounded-lg asset-meta-card">
          <span className="text-[10px] uppercase text-slate-500 block mb-1">Asset Type</span>
          <span className="text-sm font-mono text-slate-200">Algorithmic Contract</span>
        </div>
        <div className="bg-white/5 border border-white/10 p-3 rounded-lg asset-meta-card">
          <span className="text-[10px] uppercase text-slate-500 block mb-1">Origin</span>
          <span className="text-sm font-mono text-slate-200">Factory_V4</span>
        </div>
        <div className="bg-white/5 border border-white/10 p-3 rounded-lg asset-meta-card">
          <span className="text-[10px] uppercase text-slate-500 block mb-1">Owner</span>
          <span className="text-sm font-mono text-slate-200">User_01 (Admin)</span>
        </div>
        <div className="bg-white/5 border border-white/10 p-3 rounded-lg asset-meta-card">
          <span className="text-[10px] uppercase text-slate-500 block mb-1">Created</span>
          <span className="text-sm font-mono text-slate-200">2026-01-01 12:00:00 UTC</span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-black/20 p-4 rounded-lg border border-white/5">
        <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase">Manifest Description</h4>
        <p className="text-xs text-slate-500 leading-relaxed italic">
          "Core logic module for mediating interactions between the Planner and the Execution Engine.
          Handles state validation and ensures immutable audit logging during active windows."
        </p>
      </div>

    </div>
  );
}
