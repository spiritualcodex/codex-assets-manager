import { Player } from "../models/Player";
import { Match } from "../models/Match";
import { calculatePlayerRating } from "./ratePlayer";

export function getTopPerformer(match: Match): Player {
  const allPlayers = [...match.homeSquad, ...match.awaySquad];
  return allPlayers.reduce((prev, current) => {
    return calculatePlayerRating(current, match) > calculatePlayerRating(prev, match) ? current : prev;
  });
}