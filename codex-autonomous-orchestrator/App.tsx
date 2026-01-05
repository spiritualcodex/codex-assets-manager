import React, { useState, useMemo, useCallback } from 'react';
import { 
  Cpu, Rocket, RefreshCcw, Sparkles, Box, Search, 
  ChevronDown, Plus, LayoutGrid, List, Activity, 
  ShieldCheck, AlertCircle, Bot
} from 'lucide-react';
import { INITIAL_TOOLS, MISSION_PRESETS } from './constants.tsx';
import { Tool, MissionRecommendation } from './types.ts';
import ToolCard from './components/ToolCard.tsx';
import { getMissionRecommendation } from './geminiService.ts';

const App: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>(INITIAL_TOOLS);
  const [mission, setMission] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<MissionRecommendation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const categories = useMemo(() => ['All', ...Array.from(new Set(tools.map(t => t.category)))], [tools]);

  const filteredTools = useMemo(() => {
    return tools.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tools, searchQuery, activeCategory]);

  const handleAnalyzeMission = async () => {
    if (!mission.trim()) return;
    setIsAnalyzing(true);
    setRecommendation(null);
    try {
      const result = await getMissionRecommendation(mission, tools);
      setRecommendation(result);
      // Automatically select recommended tools
      const recIds = new Set(result.recommendedTools.map(r => r.toolId));
      setSelectedIds(recIds);
    } catch (error) {
      console.error("Mission Analysis Failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleTool = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#010409] text-[#e6edf3] font-sans">
      {/* Top Banner / Header */}
      <header className="border-b border-white/10 bg-[#0d1117]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-black tracking-tight uppercase">
              Codex <span className="text-indigo-400">Orchestrator</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sovereign Engine Active
            </div>
            <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider">
              System Logs
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Mission Control */}
        <div className="lg:col-span-5 space-y-8">
          <section className="bg-[#0d1117] border border-white/5 rounded-3xl p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 -mr-16 -mt-16 bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <Rocket className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-black uppercase tracking-tighter">Mission Control</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 block">Define Objective</label>
                <textarea 
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  placeholder="What are we building today?"
                  className="w-full bg-black/40 border-2 border-white/5 rounded-2xl p-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all min-h-[120px] resize-none"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {MISSION_PRESETS.map(preset => (
                  <button 
                    key={preset.label}
                    onClick={() => setMission(preset.value)}
                    className="text-[10px] font-bold bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-all text-slate-400 hover:text-white"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleAnalyzeMission}
                disabled={isAnalyzing || !mission.trim()}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
              >
                {isAnalyzing ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Run Mission Analysis
              </button>
            </div>
          </section>

          {recommendation && (
            <section className="animate-fade-in bg-indigo-950/20 border border-indigo-500/30 rounded-3xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-indigo-300">Analysis Result</h3>
                </div>
                <div className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">
                  Confidence: {Math.round(recommendation.autonomousConfidence * 100)}%
                </div>
              </div>

              <p className="text-xs text-indigo-100/70 leading-relaxed italic border-l-2 border-indigo-500/40 pl-4">
                "{recommendation.missionAnalysis}"
              </p>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Autonomous Roadmap</h4>
                <div className="space-y-3">
                  {recommendation.executionPlan.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-[10px] font-black text-indigo-400">
                          {idx + 1}
                        </div>
                        {idx < recommendation.executionPlan.length - 1 && <div className="w-px h-full bg-indigo-500/20 my-1"></div>}
                      </div>
                      <div className="pb-4">
                        <div className="text-[11px] font-bold text-white uppercase mb-1">{step.step}</div>
                        <p className="text-[10px] text-slate-500 leading-normal">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Registry */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                <Box className="w-5 h-5 text-indigo-400" />
                Node Registry
              </h2>
              <p className="text-xs text-slate-500">Active clusters and specialized modules</p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Registry Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input 
                type="text" 
                placeholder="Search registry..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-white/20 transition-all"
              />
            </div>
            <div className="relative">
              <select 
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-[#0d1117] border border-white/5 rounded-xl px-4 py-2.5 text-sm appearance-none pr-10 min-w-[160px] focus:outline-none"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
            </div>
          </div>

          {/* Tool Grid */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'flex flex-col gap-3'}>
            {filteredTools.map(tool => (
              <ToolCard 
                key={tool.id} 
                tool={tool} 
                isSelected={selectedIds.has(tool.id)} 
                onToggle={handleToggleTool} 
              />
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <Activity className="w-8 h-8 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No nodes found in this spectrum</p>
            </div>
          )}
        </div>
      </main>

      {/* Global Status Footer */}
      <footer className="border-t border-white/5 bg-[#0d1117]/50 mt-12 py-4">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between text-[10px] font-mono text-slate-600 uppercase tracking-widest">
          <div className="flex gap-8">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Security: Hardened</span>
            <span className="flex items-center gap-1.5"><Activity className="w-3 h-3" /> Latency: 12ms</span>
          </div>
          <div>
            Codex v1.0.42 — Powered by Gemini 3 Pro
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;