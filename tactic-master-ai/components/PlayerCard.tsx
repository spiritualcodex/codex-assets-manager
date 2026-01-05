import React from 'react';
import { Player } from '../types';

interface Props {
  player: Player;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const AvatarSVG: React.FC<{ visuals: Player['visuals'] }> = ({ visuals }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="35" y="70" width="30" height="30" fill={visuals.skin} filter="brightness(0.8)"/>
    <ellipse cx="50" cy="50" rx="30" ry="38" fill={visuals.skin} />
    <circle cx="18" cy="52" r="5" fill={visuals.skin} />
    <circle cx="82" cy="52" r="5" fill={visuals.skin} />
    <circle cx="35" cy="48" r="3" fill="#222"/>
    <circle cx="65" cy="48" r="3" fill="#222"/>
    <path d="M50 50 L45 60 L55 60 Z" fill={visuals.skin} filter="brightness(0.9)"/>
    {visuals.hairStyle === 'short' ? (
       <path d="M20 40 Q50 5 80 40 L80 30 Q50 -5 20 30 Z" fill={visuals.hairColor}/>
    ) : (
       <circle cx="50" cy="35" r="32" fill={visuals.hairColor} />
    )}
  </svg>
);

const PlayerCard: React.FC<Props> = ({ player, onClick, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'w-24 p-2' : size === 'lg' ? 'w-48 p-4' : 'w-32 p-3';
  const textClasses = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-lg' : 'text-sm';
  const ovrClasses = size === 'sm' ? 'text-xs top-1 left-1' : 'text-xl top-2 left-2';

  return (
    <div 
      className={`${sizeClasses} relative bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600 rounded-lg flex flex-col items-center shadow-lg cursor-pointer hover:-translate-y-1 transition-transform overflow-hidden`}
      onClick={onClick}
    >
      <div className={`absolute ${ovrClasses} font-mono font-bold text-white z-10`}>{player.ovr}</div>
      <div className="w-full aspect-square rounded-full bg-slate-900 border border-white/10 overflow-hidden mb-2 relative">
          <AvatarSVG visuals={player.visuals} />
      </div>
      <div className={`font-bold text-white ${textClasses} truncate w-full text-center`}>{player.name}</div>
      <div className="text-xs text-blue-300 font-mono">{player.position}</div>
    </div>
  );
};

export default PlayerCard;