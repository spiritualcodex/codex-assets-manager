import { Player } from "../models/Player";
import { Match } from "../models/Match";

export function calculatePlayerRating(player: Player, match: Match): number {
  const base = (player.attributes.attack + player.attributes.defense + player.attributes.technique) / 3;
  let modifier = 0;

  // Find goals/assists in match events
  const playerEvents = match.events.filter(e => e.affectedPlayers.includes(player.id));
  const goals = playerEvents.filter(e => e.type === "goal").length;
  
  modifier += goals * 1.5;
  modifier += (player.form - 0.5) * 2;
  modifier += (player.morale - 0.5) * 1;

  // Team result bonus
  const isHome = match.homeSquad.some(p => p.id === player.id);
  const win = isHome ? match.score.home > match.score.away : match.score.away > match.score.home;
  if (win) modifier += 0.5;

  return Math.min(10, Math.max(0, Number((base + modifier).toFixed(1))));
}