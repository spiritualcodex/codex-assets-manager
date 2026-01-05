import { Player } from "./Player";

export interface MatchEvent {
  minute: number;
  type: "goal" | "substitution" | "formation_change" | "injury" | "yellow_card" | "red_card";
  description: string;
  affectedPlayers: string[];
}

export interface Match {
  id: string;
  homeTeamName: string;
  awayTeamName: string;
  homeSquad: Player[];
  awaySquad: Player[];
  score: {
    home: number;
    away: number;
  };
  events: MatchEvent[];
  topPerformerId?: string;
  status: "scheduled" | "live" | "completed";
  timestamp: number;
}