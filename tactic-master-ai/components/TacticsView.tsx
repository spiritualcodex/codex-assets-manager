import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { generateText } from '../services/geminiService';
import { Shield, Swords, Zap, Brain, Loader2, Sparkles } from 'lucide-react';
import { Tactics } from '../types';

const TacticsView: React.FC = () => {
  const { state, updateTactics } = useGame();
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  const formations: Tactics['formation'][] = ['4-4-2', '4-3-3', '3-5-2', '5-3-2'];
  const mentalities: Tactics['mentality'][] = ['Defensive', 'Balanced', 'Attacking', 'Park the Bus', 'All Out Attack'];
  const passingStyles: Tactics['passingStyle'][] = ['Short', 'Mixed', 'Long Ball'];

  const getAIRecommendation = async () => {
    setAiLoading(true);
    setAiAdvice(null);
    try {
      const prompt = `Analyze my current squad and opponent. 
      My Team: ${state.team.name} (Strength: ${state.team.strength}). 
      Next Opponent: ${state.nextOpponent.name} (Strength: ${state.nextOpponent.strength}). 
      Current Tactics: ${state.tactics.formation}, ${state.tactics.mentality}.
      Provide a concise 3-sentence tactical masterplan.`;
      
      const res = await generateText(prompt, "You are a world-class elite football tactician like Pep Guardiola mixed with Jose Mourinho.");
      setAiAdvice(res);
    } catch (e) {
      setAiAdvice("Failed to connect to Tactical AI. Check connection.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* Left Column: Tactical Settings */}
      <div className="lg:col-span-1 space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield className="text-blue-500" /> Tactics Board
        </h2>

        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6 space-y-6">
          {/* Formation Select */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Formation</label>
            <div className="grid grid-cols-2 gap-2">
              {formations.map(f => (
                <button
                  key={f}
                  onClick={() => updateTactics({ formation: f })}
                  className={`py-3 rounded-lg font-mono font-bold border transition-all ${
                    state.tactics.formation === f 
                    ? 'bg-blue-600 border-blue-400 text-white shadow-lg' 
                    : 'bg-black/20 border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Mentality Select */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Team Mentality</label>
            <select 
              value={state.tactics.mentality}
              onChange={(e) => updateTactics({ mentality: e.target.value as any })}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
            >
              {mentalities.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* Passing Style */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Passing Directness</label>
            <div className="flex flex-col gap-2">
              {passingStyles.map(s => (
                <button
                  key={s}
                  onClick={() => updateTactics({ passingStyle: s })}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
                    state.tactics.passingStyle === s 
                    ? 'bg-slate-700 border-blue-500 text-white' 
                    : 'bg-black/20 border-white/5 text-gray-500 hover:bg-black/40'
                  }`}
                >
                  <span className="text-sm font-medium">{s}</span>
                  {state.tactics.passingStyle === s && <Zap size={14} className="text-blue-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendation Section */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Brain className="text-purple-400" /> AI Mastermind
            </h3>
            <button 
              onClick={getAIRecommendation}
              disabled={aiLoading}
              className="p-2 bg-indigo-600 rounded-full hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            >
              {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            </button>
          </div>

          {aiAdvice ? (
            <p className="text-sm text-indigo-100 leading-relaxed italic">"{aiAdvice}"</p>
          ) : (
            <p className="text-xs text-indigo-300/70">Click the icon to get a custom tactical analysis for the next match against {state.nextOpponent.name}.</p>
          )}
        </div>
      </div>

      {/* Right Column: Visual Pitch */}
      <div className="lg:col-span-2">
        <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-4 h-full flex flex-col items-center">
          <div className="relative w-full max-w-lg aspect-[3/4] bg-[#1a4a25] border-4 border-white/20 rounded-xl overflow-hidden shadow-2xl">
            {/* Pitch Lines */}
            <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_39px,rgba(255,255,255,0.2)_39px,rgba(255,255,255,0.2)_40px)]"></div>
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/20 rounded-full"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-white/20"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-white/20"></div>
            
            {/* Formation Dots */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between items-center text-white">
              {/* This is a simple visual representation of positions based on formation */}
              {renderFormation(state.tactics.formation)}
            </div>

            {/* Tactical Movement Arrows (Animated) */}
            <div className="absolute top-1/4 left-1/4 animate-pulse">
               <Swords size={20} className="text-red-500/50 rotate-45" />
            </div>
            <div className="absolute top-1/3 right-1/4 animate-bounce delay-75">
               <Zap size={20} className="text-yellow-500/50" />
            </div>
          </div>
          
          <div className="mt-8 flex gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-400">Home Positioning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white/20 rounded-full border border-dashed border-white"></div>
              <span className="text-xs text-gray-400">Tactical Drift</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper to render dots on the pitch
const renderFormation = (formation: string) => {
  const PlayerDot = () => <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-fade-in"></div>;
  
  switch(formation) {
    case '4-3-3':
      return (
        <div className="flex flex-col justify-between h-full w-full py-4">
           <div className="flex justify-around w-full"><PlayerDot /><PlayerDot /><PlayerDot /></div> {/* Attack */}
           <div className="flex justify-center gap-12 w-full"><PlayerDot /><PlayerDot /><PlayerDot /></div> {/* Mid */}
           <div className="flex justify-around w-full"><PlayerDot /><PlayerDot /><PlayerDot /><PlayerDot /></div> {/* Def */}
           <div className="flex justify-center w-full"><PlayerDot /></div> {/* GK */}
        </div>
      );
    case '3-5-2':
      return (
        <div className="flex flex-col justify-between h-full w-full py-4">
           <div className="flex justify-center gap-12 w-full"><PlayerDot /><PlayerDot /></div> {/* Attack */}
           <div className="flex justify-around w-full"><PlayerDot /><PlayerDot /><PlayerDot /><PlayerDot /><PlayerDot /></div> {/* Mid */}
           <div className="flex justify-center gap-16 w-full"><PlayerDot /><PlayerDot /><PlayerDot /></div> {/* Def */}
           <div className="flex justify-center w-full"><PlayerDot /></div> {/* GK */}
        </div>
      );
    case '5-3-2':
      return (
        <div className="flex flex-col justify-between h-full w-full py-4">
           <div className="flex justify-center gap-12 w-full"><PlayerDot /><PlayerDot /></div> {/* Attack */}
           <div className="flex justify-around w-full"><PlayerDot /><PlayerDot /><PlayerDot /></div> {/* Mid */}
           <div className="flex justify-around w-full"><PlayerDot /><PlayerDot /><PlayerDot /><PlayerDot /><PlayerDot /></div> {/* Def */}
           <div className="flex justify-center w-full"><PlayerDot /></div> {/* GK */}
        </div>
      );
    case '4-4-2':
    default:
      return (
        <div className="flex flex-col justify-between h-full w-full py-4">
           <div className="flex justify-center gap-12 w-full"><PlayerDot /><PlayerDot /></div> {/* Attack */}
           <div className="flex justify-around w-full"><PlayerDot /><PlayerDot /><PlayerDot /><PlayerDot /></div> {/* Mid */}
           <div className="flex justify-around w-full"><PlayerDot /><PlayerDot /><PlayerDot /><PlayerDot /></div> {/* Def */}
           <div className="flex justify-center w-full"><PlayerDot /></div> {/* GK */}
        </div>
      );
  }
};

export default TacticsView;
