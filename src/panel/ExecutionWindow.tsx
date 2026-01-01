import React from 'react';

/**
 * ðŸ”’ Phase 5: The Execution Window (Soccer Referee Edition)
 * 
 * ROLE: Referee / Whistle State
 * AUTHORITY: Advisory Only
 * 
 * This component is a strict READ-ONLY surface.
 * It observes execution state. It does NOT initiate, modify, or stop it.
 */

interface ExecutionWindowProps {
  // In a real app, these would come from the Vault/Backend
  state?: 'CLOSED' | 'OPEN'; 
  violation?: string | null;
}

export const ExecutionWindow: React.FC<ExecutionWindowProps> = ({ 
  state = 'CLOSED', 
  violation = null 
}) => {
  const isClosed = state === 'CLOSED';

  // ðŸˆ FOOTBALL METAPHOR (TEXT ONLY) - SOCCER UPDATE
          <p className="text-[10px] text-slate-600 uppercase tracking-widest">Metaphor: Referee / Whistle State</p>

  return (
    <div className="p-6 bg-[#050505] min-h-[600px] text-slate-200 font-sans relative overflow-hidden border border-white/10 rounded-xl">
      
      {/* 1ï¸âƒ£ Header Block */}
      <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight uppercase">Phase: 5 — Builder Execution Window</h2>
          <div className="flex gap-4 mt-2 text-xs font-mono text-slate-500">
            <span>Mode: Observation Only | Execution: Observation Only</span>
            <span className="text-cyan-500">Authority: Referee</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest">Metaphor: Referee / Whistle State</p>
        </div>
      </div>

      {/* 2ï¸âƒ£ Execution State Block */}
      <div className={`p-8 rounded-lg border-2 mb-8 flex flex-col items-center justify-center transition-all duration-500 ${
        isClosed 
          ? 'border-slate-800 bg-slate-900/20' 
          : 'border-amber-500/50 bg-amber-900/10 shadow-[0_0_30px_rgba(245,158,11,0.2)]'
      }`}>
        {isClosed ? (
          // CLOSED STATE
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-slate-500 tracking-widest">Execution State: CLOSED</h3>
            <p className="text-sm font-mono text-slate-600">Metaphor: Ball out of play</p>
            <p className="text-xs text-slate-700 mt-4">Meaning: No system mutation possible.</p>
          </div>
        ) : (
          // OPEN STATE
          <div className="text-center space-y-4 w-full">
            <h3 className="text-3xl font-black text-amber-500 tracking-widest animate-pulse">Execution State: OPEN</h3>
            <div className="inline-block px-4 py-1 rounded bg-amber-500/20 border border-amber-500/50 text-amber-400 font-mono text-sm">
              Metaphor: Whistle blown | Constraint: Time-Boxed & Audited
            </div>
            <div className="grid grid-cols-2 gap-8 max-w-md mx-auto mt-6 pt-6 border-t border-amber-500/20">
              <div className="text-right">
                <p className="text-[10px] text-amber-500/70 uppercase">Opened At</p>
                <p className="text-lg font-mono">14:22:01 UTC</p>
              </div>
              <div className="text-left">
                <p className="text-[10px] text-amber-500/70 uppercase">Window Expires</p>
                <p className="text-lg font-mono">14:27:01 UTC</p>
              </div>
            </div>
            {/* 4ï¸âƒ£ Violation Surface (Conditional) */}
            {violation && (
              <div className="mt-8 p-4 bg-red-950/30 border border-red-500/50 rounded flex items-center gap-4 text-left">
                <div className="text-2xl">âš ï¸</div>
                <div>
                  <h4 className="text-red-500 font-bold uppercase text-sm">Execution Halted</h4>
                  <p className="text-red-400 text-xs font-mono">Reason: {violation}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3ï¸âƒ£ Frozen Phase Guard */}
      <div className="mb-8">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Frozen Phases</h4>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(p => (
            <div key={p} className="px-4 py-2 rounded bg-black border border-slate-800 text-slate-600 flex items-center gap-2 select-none cursor-not-allowed" title="Locked">
              <span className="text-xs font-bold">PHASE {p}</span>
              <span className="text-[10px]">ðŸ”’</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-600 mt-2 italic">Frozen phases are immutable during execution.</p>
      </div>

      {/* 5ï¸âƒ£ Audit Emphasis Footer */}
      <div className="mt-auto border-t border-white/5 pt-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${isClosed ? 'bg-slate-600' : 'bg-red-500 animate-pulse'}`}></div>
           <span className="text-xs font-bold uppercase tracking-tighter text-slate-400">
             Audit Status: {isClosed ? 'STANDBY' : 'ACTIVE'}
           </span>
        </div>
        <span className="text-[10px] text-slate-600 font-mono">Audit Trail: Read-only</span>
      </div>

      {/* 6ï¸âƒ£ NO-AGENCY MARKER (MANDATORY) */}
      <div className="absolute bottom-2 right-2 opacity-30">
        <p className="text-[8px] font-mono text-slate-500 max-w-[200px] text-right">
          This view observes execution. It does not initiate, modify, or stop it.
        </p>
      </div>

    </div>
  );
};

export default ExecutionWindow;
