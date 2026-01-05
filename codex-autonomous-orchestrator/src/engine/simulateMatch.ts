import { Player } from "../models/Player";
import { Match, MatchEvent } from "../models/Match";

export function simulateMatch(
  homeTeamName: string,
  awayTeamName: string,
  homeSquad: Player[],
  awaySquad: Player[]
): Match {
  const homePower = homeSquad.reduce((acc, p) => acc + (p.attributes.attack * 0.6 + p.attributes.technique * 0.4) * p.form, 0) / homeSquad.length;
  const awayPower = awaySquad.reduce((acc, p) => acc + (p.attributes.attack * 0.6 + p.attributes.technique * 0.4) * p.form, 0) / awaySquad.length;
  
  const homeDef = homeSquad.reduce((acc, p) => acc + (p.attributes.defense * 0.8 + p.attributes.stamina * 0.2), 0) / homeSquad.length;
  const awayDef = awaySquad.reduce((acc, p) => acc + (p.attributes.defense * 0.8 + p.attributes.stamina * 0.2), 0) / awaySquad.length;

  const homeScore = Math.max(0, Math.floor(Math.random() * (homePower / awayDef) * 4));
  const awayScore = Math.max(0, Math.floor(Math.random() * (awayPower / homeDef) * 4));

  const events: MatchEvent[] = [
    { minute: 0, type: "formation_change", description: "Match started with standard formations.", affectedPlayers: [] }
  ];

  // Generate goal events
  for(let i = 0; i < homeScore; i++) {
    events.push({
      minute: Math.floor(Math.random() * 90),
      type: "goal",
      description: `Goal for ${homeTeamName}!`,
      affectedPlayers: [homeSquad[Math.floor(Math.random() * homeSquad.length)].id]
    });
  }
  
  for(let i = 0; i < awayScore; i++) {
    events.push({
      minute: Math.floor(Math.random() * 90),
      type: "goal",
      description: `Goal for ${awayTeamName}!`,
      affectedPlayers: [awaySquad[Math.floor(Math.random() * awaySquad.length)].id]
    });
  }

  events.sort((a, b) => a.minute - b.minute);

  return {
    id: `match_${Date.now()}`,
    homeTeamName,
    awayTeamName,
    homeSquad,
    awaySquad,
    score: { home: homeScore, away: awayScore },
    events,
    status: "completed",
    timestamp: Date.now()
  };
}