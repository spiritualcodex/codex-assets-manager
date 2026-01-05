import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { GameView } from './types';
import Dashboard from './components/Dashboard';
import MatchView from './components/MatchView';
import VeoStudio from './components/VeoStudio';
import LiveAssistant from './components/LiveAssistant';
import PlayerCard from './components/PlayerCard';
import TacticsView from './components/TacticsView';
import { Home, Users, LogOut, LayoutGrid, MonitorPlay } from 'lucide-react';

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-lg mb-1 transition-colors ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
  >
    {icon}
    <span className="font-medium text-sm hidden md:inline">{label}</span>
  </button>
);

const AppContent: React.FC = () => {
  const { state, setView } = useGame();

  const renderView = () => {
    switch (state.view) {
      case GameView.HOME: return <Dashboard />;
      case GameView.MATCH: return <MatchView />;
      case GameView.VEO_STUDIO: return <VeoStudio />;
      case GameView.TACTICS: return <TacticsView />;
      case GameView.SQUAD: 
        return (
          <div className="p-8">
             <h2 className="text-2xl font-bold text-white mb-6">First Team Squad</h2>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {state.team.roster.map(p => <PlayerCard key={p.id} player={p} size="lg" />)}
             </div>
          </div>
        );
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0f1115] text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-16 md:w-64 bg-[#0d1117] border-r border-white/5 flex flex-col justify-between shrink-0 z-20">
         <div className="p-4">
             <div className="flex items-center gap-3 mb-8 px-2">
                 <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center font-bold text-white text-xs">TM</div>
                 <span className="font-bold text-white hidden md:inline">TacticMaster</span>
             </div>
             
             <SidebarItem icon={<Home size={20} />} label="Dashboard" active={state.view === GameView.HOME} onClick={() => setView(GameView.HOME)} />
             <SidebarItem icon={<Users size={20} />} label="Squad" active={state.view === GameView.SQUAD} onClick={() => setView(GameView.SQUAD)} />
             <SidebarItem icon={<LayoutGrid size={20} />} label="Tactics" active={state.view === GameView.TACTICS} onClick={() => setView(GameView.TACTICS)} />
             <SidebarItem icon={<MonitorPlay size={20} />} label="Veo Studio" active={state.view === GameView.VEO_STUDIO} onClick={() => setView(GameView.VEO_STUDIO)} />
         </div>
         
         <div className="p-4 border-t border-white/5">
            <SidebarItem icon={<LogOut size={20} />} label="Quit Game" onClick={() => window.location.reload()} />
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-gradient-to-br from-[#0f1115] to-[#13161c]">
         {renderView()}
      </main>

      {/* Voice Assistant Overlay */}
      <LiveAssistant />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;
