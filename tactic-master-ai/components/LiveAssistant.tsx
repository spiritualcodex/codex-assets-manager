import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Radio, X } from 'lucide-react';
import { connectLiveAssistant } from '../services/geminiService';
import { useGame } from '../context/GameContext';

const LiveAssistant: React.FC = () => {
  const { state } = useGame();
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const disconnectRef = useRef<(() => void) | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const toggleSession = async () => {
    if (isActive) {
      // Disconnect
      if (disconnectRef.current) disconnectRef.current();
      setIsActive(false);
      setStatus('idle');
      return;
    }

    setIsActive(true);
    setStatus('connecting');
    setError(null);

    try {
      const contextStr = `Current Team: ${state.team.name}. Manager: ${state.manager.name}. Next Opponent: ${state.nextOpponent.name} (Strength: ${state.nextOpponent.strength}). Funds: ${state.manager.funds}.`;
      
      const disconnect = await connectLiveAssistant({
        onConnect: () => setStatus('listening'),
        onClose: () => {
            setIsActive(false);
            setStatus('idle');
        },
        onMessage: (text) => {
           // We could log transcription here if needed
           console.log("Assistant transcribed:", text);
        },
        onAudioData: (buffer) => {
           setStatus('speaking');
           setTimeout(() => setStatus('listening'), buffer.duration * 1000);
           visualizeAudio();
        }
      }, contextStr);
      
      disconnectRef.current = disconnect;
    } catch (e) {
      console.error(e);
      setError("Failed to connect to AI Assistant");
      setIsActive(false);
      setStatus('idle');
    }
  };

  // Simple visualizer
  const visualizeAudio = () => {
     // Mock visualization for UI feedback
     const ctx = canvasRef.current?.getContext('2d');
     if(!ctx || !canvasRef.current) return;
     const w = canvasRef.current.width;
     const h = canvasRef.current.height;
     
     let frame = 0;
     const animate = () => {
         if(!isActive) return;
         ctx.clearRect(0,0,w,h);
         ctx.fillStyle = '#3b82f6';
         const barCount = 10;
         const barWidth = w / barCount;
         for(let i=0; i<barCount; i++) {
             const height = Math.random() * h * (status === 'speaking' ? 0.8 : 0.2);
             ctx.fillRect(i * barWidth, h/2 - height/2, barWidth - 2, height);
         }
         if(isActive) requestAnimationFrame(animate);
     };
     animate();
  };

  useEffect(() => {
    return () => {
      if (disconnectRef.current) disconnectRef.current();
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
       {error && (
           <div className="bg-red-900/80 text-white text-xs p-2 rounded mb-2 border border-red-500 animate-fade-in">
               {error}
           </div>
       )}
       
       {isActive && (
         <div className="bg-slate-900 border border-blue-500/30 rounded-lg p-4 w-64 shadow-2xl backdrop-blur-md mb-2 animate-fade-in">
            <div className="flex justify-between items-center mb-2">
                <span className="text-blue-400 font-bold text-xs uppercase flex items-center gap-2">
                   <Radio className={`w-3 h-3 ${status === 'speaking' ? 'animate-pulse text-green-400' : ''}`} />
                   AI Assistant Live
                </span>
                <button onClick={toggleSession}><X className="w-4 h-4 text-gray-400 hover:text-white"/></button>
            </div>
            <div className="h-16 bg-black/40 rounded flex items-center justify-center overflow-hidden relative">
                <canvas ref={canvasRef} width={220} height={64} className="w-full h-full" />
                <div className="absolute text-xs text-gray-500 font-mono">
                    {status === 'connecting' ? 'Connecting...' : status === 'speaking' ? 'Assistant Speaking...' : 'Listening...'}
                </div>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 text-center">
                Ask about tactics, opponent weakness, or morale.
            </p>
         </div>
       )}

       <button 
         onClick={toggleSession}
         className={`h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-105 ${isActive ? 'bg-red-600 hover:bg-red-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-500'}`}
       >
         {isActive ? <MicOff className="text-white" /> : <Mic className="text-white" />}
       </button>
    </div>
  );
};

export default LiveAssistant;