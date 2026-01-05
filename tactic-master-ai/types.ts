
export interface Player {
  id: string;
  name: string;
  position: string;
  ovr: number;
  age: number;
  visuals: { skin: string; hairColor: string; hairStyle: string };
  stats: { att: number; def: number; spd: number };
  trait: string;
  morale: 'happy' | 'neutral' | 'unhappy';
}

export interface Team {
  name: string;
  strength: number;
  roster: Player[];
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gd: number;
}

export interface Tactics {
  formation: '4-4-2' | '4-3-3' | '3-5-2' | '5-3-2';
  mentality: 'Defensive' | 'Balanced' | 'Attacking' | 'Park the Bus' | 'All Out Attack';
  passingStyle: 'Short' | 'Mixed' | 'Long Ball';
}

export interface Manager {
  name: string;
  club: string;
  funds: number;
  reputation: number;
}

export interface MatchEvent {
  time: number;
  type: 'goal' | 'miss' | 'save' | 'foul' | 'card' | 'whistle' | 'commentary';
  player: string;
  description: string;
}

export enum GameView {
  HOME = 'HOME',
  SQUAD = 'SQUAD',
  TACTICS = 'TACTICS',
  MATCH = 'MATCH',
  VEO_STUDIO = 'VEO_STUDIO',
  LEAGUE = 'LEAGUE'
}

export interface GameState {
  manager: Manager;
  team: Team;
  league: Team[];
  view: GameView;
  day: number;
  week: number;
  nextOpponent: Team;
  tactics: Tactics;
}

// Defined interface to match platform requirements for the window.aistudio property
export interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
    // Modified to match existing platform modifiers and types
    readonly aistudio: AIStudio;
  }
}
