import React from 'react';

export function Dashboard() {
    return (
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">

            {/* Welcome Tile */}
            <div className="col-span-full mb-4">
                <h2 className="text-3xl font-black text-white mb-2">Command Center</h2>
                <p className="text-slate-400">System status overview and navigation.</p>
            </div>

            {/* Tiles */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400 group-hover:text-purple-300">
                        🔮
                    </div>
                    <span className="text-xs font-mono text-slate-500">Soul Decoder</span>
                </div>
                <h3 className="text-xl font-bold mb-1">Inference Engine</h3>
                <p className="text-sm text-slate-400">4 active sessions. 98% accuracy.</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400 group-hover:text-cyan-300">
                        📦
                    </div>
                    <span className="text-xs font-mono text-slate-500">Asset Manager</span>
                </div>
                <h3 className="text-xl font-bold mb-1">Vault Inventory</h3>
                <p className="text-sm text-slate-400">142 verified assets. 3 drafts.</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-green-500/10 rounded-lg text-green-400 group-hover:text-green-300">
                        ⚽
                    </div>
                    <span className="text-xs font-mono text-slate-500">Match Day</span>
                </div>
                <h3 className="text-xl font-bold mb-1">Live Simulation</h3>
                <p className="text-sm text-slate-400">Match active. Time: 45:00.</p>
            </div>

        </div>
    );
}
