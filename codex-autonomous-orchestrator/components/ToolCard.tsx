import React from 'react';
import { Tool, ToolStatus } from '../types.ts';
import { Shield, Zap, Globe, Cpu, CheckCircle, Activity, ExternalLink, Settings } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, isSelected, onToggle }) => {
  const statusColors = {
    [ToolStatus.Active]: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5',
    [ToolStatus.Legacy]: 'text-orange-400 border-orange-500/30 bg-orange-500/5',
    [ToolStatus.Optional]: 'text-blue-400 border-blue-500/30 bg-blue-500/5',
    [ToolStatus.Locked]: 'text-rose-400 border-rose-500/30 bg-rose-500/5',
    [ToolStatus.Experimental]: 'text-purple-400 border-purple-500/30 bg-purple-500/5',
    [ToolStatus.Archived]: 'text-slate-500 border-slate-500/30 bg-slate-500/5',
    [ToolStatus.Deprecated]: 'text-red-400 border-red-500/30 bg-red-500/5',
  };

  return (
    <div 
      onClick={() => onToggle(tool.id)}
      className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden
        ${isSelected 
          ? 'border-indigo-500/60 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
          : 'border-white/5 bg-[#0d1117] hover:border-white/20 hover:bg-[#161b22]'
        }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
          {tool.category.includes('Runtime') && <Terminal className="w-5 h-5 text-indigo-400" />}
          {tool.category.includes('AI') && <Cpu className="w-5 h-5 text-purple-400" />}
          {tool.category.includes('Cloud') && <Globe className="w-5 h-5 text-blue-400" />}
          {tool.category.includes('Auth') && <Shield className="w-5 h-5 text-emerald-400" />}
          {!['Runtime', 'AI', 'Cloud', 'Auth'].some(k => tool.category.includes(k)) && <Activity className="w-5 h-5 text-slate-400" />}
        </div>
        <div className={`text-[10px] font-bold px-2 py-1 rounded-full border ${statusColors[tool.status]}`}>
          {tool.status}
        </div>
      </div>

      <h3 className="text-white font-bold text-sm mb-1 group-hover:text-indigo-400 transition-colors">{tool.name}</h3>
      <p className="text-xs text-slate-400 leading-snug mb-4 line-clamp-2">{tool.role}</p>

      <div className="flex flex-wrap gap-1 mb-4">
        {tool.capabilities.slice(0, 3).map(cap => (
          <span key={cap} className="text-[9px] bg-white/5 px-2 py-0.5 rounded uppercase tracking-wider text-slate-500">
            {cap}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span className="flex items-center gap-1">
          <Settings className="w-3 h-3" />
          {tool.executionMode}
        </span>
        <span className="flex items-center gap-1">
          <Zap className={`w-3 h-3 ${tool.autonomousLevel === 'full' ? 'text-indigo-400' : 'text-slate-500'}`} />
          {tool.autonomousLevel}
        </span>
      </div>

      {isSelected && (
        <div className="absolute top-3 right-3">
          <CheckCircle className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
        </div>
      )}
    </div>
  );
};

export default ToolCard;

const Terminal = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);