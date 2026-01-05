import React, { useState } from 'react';
import { NavigationHub } from './components/NavigationHub';
import { Dashboard } from './components/Dashboard';
import { AssetManagerShell } from '../../codex-assets-manager/src/office/AssetManagerShell'; // Virtual import path - likely needs adjustment
import { SoulDecoderView } from '../../soul-decoder/src/SoulDecoderView';
import { GameWrapper } from '../../game-ui/src/GameWrapper';
import { NavigationTab } from '../../shared-contracts/types';

export default function App() {
    const [activeTab, setActiveTab] = useState<NavigationTab>('office');

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a] text-white">
            {/* Navigation Header */}
            <NavigationHub activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Main Content Area - Stacked to preserve state */}
            <main className="flex-1 relative overflow-hidden">

                {/* OFFICE DASHBOARD */}
                <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'office' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                    <Dashboard />
                </div>

                {/* ASSET MANAGER */}
                <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'assets' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                    {/* We lazy load or keep mounted? Keep mounted for search state preservation */}
                    <AssetManagerShell />
                </div>

                {/* SOUL DECODER */}
                <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'decoder' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                    <SoulDecoderView />
                </div>

                {/* GAME UI - ALWAYS MOUNTED & VISIBLE IF ACTIVE */}
                {/* If Game is backgrounded but running, opacity 0. If active, opacity 100. */}
                <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'game' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                    <GameWrapper isActive={activeTab === 'game'} />
                </div>

            </main>
        </div>
    );
}
