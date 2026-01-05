import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameState, GameView, Team, Player, Tactics } from '../types';

const INITIAL_TEAM: Team = {
  name: "User FC",
  strength: 75,
  roster: [],
  points: 0,
  played: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  gd: 0
};

const MOCK_OPPONENT: Team = {
  name: "London Red",
  strength: 80,
  roster: [],
  points: 3,
  played: 1,
  won: 1,
  drawn: 0,
  lost: 0,
  gd: 2
};

const INITIAL_STATE: GameState = {
  manager: { name: "Coach Prime", club: "User FC", funds: 5000000, reputation: 50 },
  team: INITIAL_TEAM,
  league: [INITIAL_TEAM, MOCK_OPPONENT],
  view: GameView.HOME,
  day: 1,
  week: 1,
  nextOpponent: MOCK_OPPONENT,
  tactics: {
    formation: '4-4-2',
    mentality: 'Balanced',
    passingStyle: 'Mixed'
  }
};

interface GameContextType {
  state: GameState;
  setView: (view: GameView) => void;
  addFunds: (amount: number) => void;
  advanceDay: () => void;
  updateTactics: (newTactics: Partial<Tactics>) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  // Generate initial roster if empty
  useEffect(() => {
    if (state.team.roster.length === 0) {
      const positions = ["GK", "LB", "CB", "CB", "RB", "CM", "CM", "CAM", "LW", "RW", "ST"];
      const newRoster: Player[] = positions.map((pos, i) => ({
        id: `p-${i}`,
        name: `Player ${i}`,
        position: pos,
        ovr: 70 + Math.floor(Math.random() * 15),
        age: 18 + Math.floor(Math.random() * 12),
        visuals: { skin: '#d9a879', hairColor: '#3b2618', hairStyle: 'short' },
        stats: { att: 70, def: 70, spd: 70 },
        trait: 'Balanced',
        morale: 'neutral'
      }));
      setState(prev => ({ ...prev, team: { ...prev.team, roster: newRoster } }));
    }
  }, []);

  const setView = (view: GameView) => setState(prev => ({ ...prev, view }));
  
  const addFunds = (amount: number) => setState(prev => ({
    ...prev, manager: { ...prev.manager, funds: prev.manager.funds + amount }
  }));

  const advanceDay = () => setState(prev => ({
    ...prev, day: prev.day + 1
  }));

  const updateTactics = (newTactics: Partial<Tactics>) => setState(prev => ({
    ...prev,
    tactics: { ...prev.tactics, ...newTactics }
  }));

  return (
    <GameContext.Provider value={{ state, setView, addFunds, advanceDay, updateTactics }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};
