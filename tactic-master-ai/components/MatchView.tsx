import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { generateText } from '../services/geminiService';
import { Play, Pause, FastForward, Activity } from 'lucide-react';
import { GameView } from '../types';

const MatchView: React.FC = () => {
  const { state, setView } = useGame();
  const [time, setTime] = useState(0);
  const [score, setScore] = useState({ home: 0, away: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const [momentum, setMomentum] = useState(50);
  const [analysis, setAnalysis] = useState<string>("");

  const commentaryRef = useRef<HTMLDivElement>(null);

  // Auto-scroll commentary
  useEffect(() => {
    if (commentaryRef.current) {
      commentaryRef.current.scrollTop = 0;
    }
  }, [events]);

  // Match Loop
  useEffect(() => {
    let interval: any;
    if (isPlaying && time < 90) {
      interval = setInterval(() => {
        setTime(t => {
          if (t >= 90) {
            setIsPlaying(false);
            return 90;
          }
          return t + 1;
        });

        // Sim events
        if (Math.random() < 0.3) {
           const newMomentum = Math.max(20, Math.min(80, momentum + (Math.random() - 0.5) * 10));
           setMomentum(newMomentum);
        }

        if (Math.random() < 0.05) {
           const isHome = momentum > 50 ? Math.random() < 0.7 : Math.random() < 0.3;
           const type = Math.random() < 0.15 ? 'GOAL' : 'CHANCE';
           
           if (type === 'GOAL') {
              if(isHome) setScore(s => ({...s, home: s.home+1}));
              else setScore(s => ({...s, away: s.away+1}));
              addEvent(`${isHome ? state.team.name : state.nextOpponent.name} SCORES!`, 'text-yellow-400 font-bold text-lg');
           } else {
              addEvent(`${isHome ? state.team.name : state.nextOpponent.name} chance just wide.`, 'text-white');
           }
        }

      }, 200); // Speed
    }
    return () => clearInterval(interval);
  }, [isPlaying, time, momentum]);

  const addEvent = (text: string, style: string = 'text-gray-400') => {
    setEvents(prev => [`${time}' ${text}|${style}`, ...prev]);
  };

  const getAIAnalysis = async () => {
    setAnalysis("Analyzing match data...");
    const prompt = `Match Time: ${time}'. Score: ${state.team.name} ${score.home} - ${score.away} ${state.nextOpponent.name}. Momentum: ${momentum > 50 ? 'Dominating' : 'Under Pressure'}. Give 1 sentence tactical advice.`;
    const res = await generateText(prompt, "You are a tactical assistant manager.");
    setAnalysis(res);
  };

  return (
    <div className="h-full flex flex-col bg-black relative">
       {/* Scoreboard */}
       <div className="h-24 bg-gradient-to-b from-slate-900 to-black border-b border-white/10 flex items-center justify-between px-8">
           <div className="text-3xl font-bold text-white w-1/3 text-right">{state.team.name}</div>
           <div className="text-center w-1/3">
              <div className="text-5xl font-mono font-bold text-yellow-500 bg-slate-800/50 px-6 py-2 rounded-lg inline-block border border-white/10">
                 {score.home} - {score.away}
              </div>
              <div className="text-sm text-gray-400 mt-1 font-mono">{time}'</div>
           </div>
           <div className="text-3xl font-bold text-gray-400 w-1/3 text-left">{state.nextOpponent.name}</div>
       </div>

       {/* Visualizer Area */}
       <div className="flex-1 relative bg-emerald-900/20 flex flex-col items-center justify-center overflow-hidden">
           {/* Pitch Graphic */}
           <div className="w-[600px] h-[400px] border-4 border-white/20 rounded-lg relative bg-[#1a4a25] shadow-2xl overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(0deg,transparent,transparent_49px,rgba(255,255,255,0.2)_49px,rgba(255,255,255,0.2)_50px)]"></div>
              <div className="absolute top-1/2 left-1/2 w-32 h-32 border-4 border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-0 left-1/4 bottom-0 w-px bg-white/10"></div>
              <div className="absolute top-0 right-1/4 bottom-0 w-px bg-white/10"></div>
              
              {/* Momentum Visualizer */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10">
                 <div 
                   className="h-full bg-gradient-to-r from-blue-500 to-red-500 transition-all duration-500" 
                   style={{ width: '100%', transform: `scaleX(${momentum/100})`, transformOrigin: 'left' }}
                 ></div>
              </div>

              {/* Dynamic Dots */}
              {isPlaying && (
                <div className="absolute inset-0">
                   <div className="absolute w-4 h-4 bg-yellow-400 rounded-full shadow-lg blur-[2px] animate-bounce" style={{ top: '50%', left: `${momentum}%`, transition: 'left 0.5s' }}></div>
                </div>
              )}
           </div>

           {/* AI Analysis Popup */}
           {analysis && (
             <div className="absolute top-4 bg-purple-900/90 text-purple-100 p-4 rounded-xl border border-purple-500/50 max-w-md backdrop-blur-md animate-fade-in shadow-xl">
                 <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider text-purple-300">
                    <Activity size={14} /> AI Insight
                 </div>
                 {analysis}
             </div>
           )}
       </div>

       {/* Controls & Commentary */}
       <div className="h-48 bg-slate-900 border-t border-white/10 flex">
           <div className="w-1/3 p-6 border-r border-white/10 flex flex-col gap-4">
              <div className="flex gap-2 justify-center">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 rounded-full bg-white text-black hover:bg-gray-200">
                     {isPlaying ? <Pause /> : <Play />}
                  </button>
                  <button onClick={getAIAnalysis} className="px-4 py-2 rounded-lg bg-purple-600 text-white font-bold text-sm hover:bg-purple-500">
                     Ask AI Assistant
                  </button>
              </div>
              {time >= 90 && (
                <button onClick={() => setView(GameView.HOME)} className="w-full bg-blue-600 py-3 rounded text-white font-bold">
                   End Match
                </button>
              )}
           </div>

           <div className="flex-1 p-4 relative" ref={commentaryRef}>
               <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 sticky top-0 bg-slate-900">Live Feed</h4>
               <div className="flex flex-col gap-1">
                   {events.map((e, i) => {
                       const [txt, style] = e.split('|');
                       return <div key={i} className={`text-sm ${style} font-mono border-b border-white/5 pb-1`}>{txt}</div>;
                   })}
               </div>
           </div>
       </div>
    </div>
  );
};

export default MatchView;