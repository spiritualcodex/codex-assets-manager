import React from 'react';

// asset-logs-container
export function LogsTab() {
  const logs = [
    { time: '14:22:01', level: 'INFO', msg: 'Match started (Runtime Init)' },
    { time: '14:22:05', level: 'DEBUG', msg: 'Player position sync: OK' },
    { time: '14:23:12', level: 'WARN', msg: 'High latency detected in midfield' },
    { time: '14:24:00', level: 'INFO', msg: 'Asset state snapshot saved' },
    { time: '14:25:30', level: 'INFO', msg: 'External API uplink established' },
  ];

  return (
    <div className="asset-logs-container bg-black p-4 font-mono text-xs h-full text-slate-300 animate-in fade-in duration-500">

      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
        <span className="font-bold text-slate-500 uppercase">Live Match Log</span>
        <div className="flex gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[10px] text-green-500">REC</span>
        </div>
      </div>

      <div className="space-y-1 h-[300px] overflow-y-auto custom-scrollbar pr-2">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-3 hover:bg-white/5 p-1 rounded transition-colors group">
            <span className="text-slate-600 shrink-0 select-none">{log.time}</span>
            <span className={`shrink-0 font-bold ${log.level === 'INFO' ? 'text-cyan-600' :
                log.level === 'WARN' ? 'text-amber-600' :
                  log.level === 'DEBUG' ? 'text-purple-600' : 'text-slate-600'
              }`}>
              [{log.level}]
            </span>
            <span className="text-slate-400 group-hover:text-slate-200 transition-colors">
              {log.msg}
            </span>
          </div>
        ))}
        {/* Cursor Mock */}
        <div className="text-cyan-500 animate-pulse mt-2">_</div>
      </div>

    </div>
  );
}
