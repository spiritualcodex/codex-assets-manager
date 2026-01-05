import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  Cpu, Terminal, ChevronDown, RefreshCcw, Sparkles, Share2, FileCode,
  Filter, Database, Globe, Volume2, VolumeX, Eye, Lightbulb,
  Zap, Search, Activity, HelpCircle, Info, Plus, X, ListPlus, Box, AlertTriangle, ShieldCheck, BookOpen, Shield, Trophy, Users, TrendingUp, AlertCircle, Layers, Pin, PinOff
} from 'lucide-react';
import { INITIAL_TOOLS, MISSION_PRESETS } from './constants.tsx';
import { Tool, ToolStatus, MissionRecommendation } from './types.ts';
import ToolCard from './components/ToolCard.tsx';
import { getMissionRecommendation } from './geminiService.ts';

const App: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>(INITIAL_TOOLS);
  const [manualSelectedIds, setManualSelectedIds] = useState<Set<string>>(new Set());
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
  const [mission, setMission] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(false); 
  const [explanationMode, setExplanationMode] = useState<'read' | 'explain'>('explain');
  const [recommendation, setRecommendation] = useState<MissionRecommendation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Voice States
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');

  useEffect(() => {
    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length === 0) return;
      const uniqueVoices = availableVoices.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);
      setVoices(uniqueVoices);
      if (!selectedVoiceName && uniqueVoices.length > 0) {
        const preferred = uniqueVoices.find(v => v.name.includes('Natural') || v.name.includes('Google US English')) || 
                        uniqueVoices.find(v => v.lang.startsWith('en')) || 
                        uniqueVoices[0];
        setSelectedVoiceName(preferred.name);
      }
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, [selectedVoiceName]);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!isSpeakerEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoiceName);
    if (voice) utterance.voice = voice;
    utterance.onend = () => onEnd && onEnd();
    window.speechSynthesis.speak(utterance);
  }, [isSpeakerEnabled, selectedVoiceName, voices]);

  const stopSpeaking = useCallback(() => { window.speechSynthesis.cancel(); }, []);

  const categories = useMemo(() => ['All', ...Array.from(new Set(tools.map(t => t.category)))], [tools]);

  const filteredTools = useMemo(() => {
    return tools.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.capabilities.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tools, searchQuery, activeCategory]);

  const aiSelectedIds = useMemo(() => new Set(recommendation?.recommendedTools.map(rt => rt.toolId) || []), [recommendation]);

  const handleToggleTool = useCallback((id: string) => {
    setManualSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleTogglePin = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setPinnedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleAnalyzeMission = async () => {
    if (!mission.trim()) return;
    setIsAnalyzing(true);
    setRecommendation(null);
    try {
      const result = await getMissionRecommendation(mission, tools);
      setRecommendation(result);
      if (isSpeakerEnabled) speak("Mission parameters received. Constructing optimal autonomous node cluster.");
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearWorkspace = () => {
    setManualSelectedIds(new Set());
    setRecommendation(null);
    setMission('');
    stopSpeaking();
  };

  const pinnedTools = tools.filter(t => pinnedIds.has(t.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#010409] text-slate-200">
      <header className="sticky top-0 z-50 bg-[#0d1117]/90 backdrop-blur-2xl border-b border-white/5 px-6 lg:px-12 py-3 shadow-2xl">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-tr from-indigo-900 to-indigo-600 p-2 rounded-xl border border-indigo-400/30 shadow-lg">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter text-white uppercase flex items-center gap-2">
                Codex <span className="text-indigo-400">Orchestrator</span>
              </h1>
              <div className="flex items-center gap-2 text-[9px] text-slate-500 font-mono font-bold uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                Active_Link — v1.0.1
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 bg-black/40 border border-white/5 p-1 rounded-xl">
               <button onClick={() => setExplanationMode('read')} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${explanationMode === 'read' ? 'bg-slate-700 text-white' : 'text-slate-600'}`}>Read</button>
               <button onClick={() => setExplanationMode('explain')} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${explanationMode === 'explain' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20' : 'text-slate-600'}`}>Explain</button>
            </div>
            
            <button 
              onClick={() => { if (isSpeakerEnabled) stopSpeaking(); setIsSpeakerEnabled(!isSpeakerEnabled); }}
              className={`p-2.5 rounded-xl transition-all shadow-xl active:scale-90 ${isSpeakerEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-600'}`}
            >
              {isSpeakerEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button onClick={() => setIsGuideOpen(true)} className="p-2.5 rounded-xl border border-white/10 hover:border-indigo-500/30 bg-black/40 text-slate-400 hover:text-indigo-400 transition-all active:scale-95">
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1800px] mx-auto w-full p-6 lg:p-12 space-y-12">
        <section className="bg-gradient-to-b from-[#0d1117] to-transparent p-1 border-b border-white/5 -mt-12 pt-20 pb-12 rounded-b-[4rem]">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em]">Command Center</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">What is your mission?</h2>
            </div>
            
            <div className="relative group">
              <textarea 
                value={mission} 
                onChange={(e) => setMission(e.target.value)}
                placeholder="Enter objective..."
                className="w-full bg-black/40 border-2 border-white/5 rounded-[2.5rem] p-8 text-lg font-bold text-white placeholder:text-slate-800 focus:outline-none focus:border-indigo-500/40 min-h-[140px] resize-none leading-tight transition-all shadow-inner"
              />
              <div className="absolute bottom-6 right-6 flex items-center gap-3">
                  <select 
                    onChange={(e) => setMission(MISSION_PRESETS.find(p => p.label === e.target.value)?.value || '')}
                    className="bg-slate-900/80 border border-white/10 text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl focus:outline-none cursor-pointer hover:bg-slate-800 transition-all"
                  >
                    <option value="">Presets...</option>
                    {MISSION_PRESETS.map(p => <option key={p.label} value={p.label}>{p.label}</option>)}
                  </select>
                  <button 
                    onClick={handleAnalyzeMission}
                    disabled={isAnalyzing || !mission}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl
                      ${isAnalyzing ? 'bg-slate-800 text-slate-600' : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'}`}
                  >
                    {isAnalyzing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    Solve Mission
                  </button>
              </div>
            </div>
          </div>
        </section>

        {recommendation && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-6 duration-500">
             <div className="lg:col-span-4 bg-indigo-950/20 rounded-[3rem] border border-indigo-500/20 p-8 space-y-6">
                <h3 className="text-xs font-black uppercase text-indigo-400 tracking-widest">Autonomous Logic</h3>
                <p className="text-sm text-slate-300 font-medium leading-relaxed italic border-l-2 border-indigo-500/40 pl-4">{recommendation.missionAnalysis}</p>
             </div>
             
             <div className="lg:col-span-8 bg-[#0d1117] rounded-[3rem] border border-white/5 p-8">
                <h3 className="text-xs font-black uppercase text-white tracking-[0.3em] mb-8">Execution Roadmap</h3>
                <div className="space-y-6">
                   {recommendation.executionPlan.map((step, i) => (
                     <div key={i} className="flex gap-6 group">
                        <div className="flex flex-col items-center">
                           <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-[10px] font-black text-indigo-400">0{i+1}</div>
                           {i < recommendation.executionPlan.length - 1 && <div className="w-px flex-1 bg-white/5 my-2"></div>}
                        </div>
                        <div className="flex-1 pb-8">
                           <h4 className="text-[11px] font-black uppercase text-white tracking-widest mb-1">{step.step}</h4>
                           <p className="text-xs text-slate-400">{step.description}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </section>
        )}

        <section className="space-y-8">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-white/5 pb-8">
            <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
              <Box className="w-6 h-6 text-indigo-500"/>
              Registry Nodes
            </h2>
            <div className="flex items-center gap-4">
              <select 
                value={activeCategory} 
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-black/40 border border-white/10 text-white text-[10px] font-black uppercase px-4 py-3 rounded-xl focus:border-indigo-500/40 outline-none"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input 
                type="text" 
                placeholder="Search tools..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-bold text-white placeholder:text-slate-800 focus:outline-none min-w-[240px]"
              />
              <button onClick={clearWorkspace} className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-rose-400 transition-colors">Wipe</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map(tool => (
              <ToolCard 
                key={tool.id} 
                tool={tool} 
                isSelected={manualSelectedIds.has(tool.id)} 
                isRecommended={aiSelectedIds.has(tool.id)} 
                onToggle={handleToggleTool}
                onPin={(e) => handleTogglePin(e, tool.id)}
                isPinned={pinnedIds.has(tool.id)}
                isSpeakerEnabled={isSpeakerEnabled} 
                explanationMode={explanationMode} 
                speak={speak} 
                stopSpeaking={stopSpeaking}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-[#0d1117] border-t border-white/5 px-12 py-6">
        <div className="max-w-[1800px] mx-auto w-full flex items-center justify-between text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest">
           <span>Nodes: {tools.length}</span>
           <span>© 2025 Sovereign Codex Orchestrator</span>
        </div>
      </footer>
    </div>
  );
};

export default App;