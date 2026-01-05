import React from 'react';

// asset-runtime-container
export function RuntimeTab() {
  return (
    <div className="asset-runtime-container p-4 space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
        Match Performance (Runtime Stats)
      </h3>

      {/* KPI Cards (Soccer Metaphor) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/40 border border-amber-500/20 p-4 rounded-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-20 text-6xl">⚽</div>
          <span className="text-[10px] text-amber-500 uppercase tracking-widest block mb-1">Current Form</span>
          <span className="text-3xl font-black text-amber-500">92<span className="text-sm font-normal text-slate-500">/100</span></span>
          <div className="w-full bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full w-[92%]"></div>
          </div>
        </div>

        <div className="bg-black/40 border border-cyan-500/20 p-4 rounded-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-20 text-6xl">📊</div>
          <span className="text-[10px] text-cyan-500 uppercase tracking-widest block mb-1">Possession (Uptime)</span>
          <span className="text-3xl font-black text-cyan-400">99.9<span className="text-sm font-normal text-slate-500">%</span></span>
          <div className="w-full bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-full w-[99.9%]"></div>
          </div>
        </div>
      </div>

      {/* Detailed Stats List */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/5 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Passes Completed (Requests)</span>
          <span className="font-mono text-slate-200">14,203</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Fouls Committed (Errors)</span>
          <span className="font-mono text-red-400">2</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Avg. Pace (Latency)</span>
          <span className="font-mono text-green-400">12ms</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Fixture Difficulty (Load)</span>
          <span className="font-mono text-slate-200">Medium</span>
        </div>
      </div>

    </div>
  );
}
