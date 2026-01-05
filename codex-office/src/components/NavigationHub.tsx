import React from 'react';
import { NavigationTab } from '../../shared-contracts/types';

interface NavProps {
    activeTab: NavigationTab;
    onTabChange: (tab: NavigationTab) => void;
}

export function NavigationHub({ activeTab, onTabChange }: NavProps) {
    const tabs: { id: NavigationTab; label: string; icon: string }[] = [
        { id: 'office', label: 'Office', icon: '🏢' },
        { id: 'assets', label: 'Assets', icon: '📦' },
        { id: 'decoder', label: 'Soul Decoder', icon: '🔮' },
        { id: 'game', label: 'Match Day', icon: '⚽' },
    ];

    return (
        <header className="h-14 bg-black/50 backdrop-blur border-b border-white/10 flex items-center px-4 justify-between z-50">
            <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg tracking-tight text-white">CODEX<span className="text-cyan-500">OS</span></h1>
            </div>

            <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                : 'text-slate-400 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </nav>

            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                SYSTEM ONLINE
            </div>
        </header>
    );
}
