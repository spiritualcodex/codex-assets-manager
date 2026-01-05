import { Player } from "../models/Player";

export function describePlayerStrengths(player: Player): string[] {
  const strengths: string[] = [];
  const attrs = player.attributes;

  if (attrs.attack >= 8) strengths.push("Clinical finishing");
  if (attrs.attack >= 7 && attrs.technique >= 7) strengths.push("Creative playmaker");
  if (attrs.defense >= 8) strengths.push("Defensive rock");
  if (attrs.stamina >= 8) strengths.push("Engine-room workrate");
  if (attrs.pace >= 8) strengths.push("Explosive speed");
  if (attrs.technique >= 9) strengths.push("World-class ball control");

  if (strengths.length === 0) strengths.push("Reliable team player");
  
  return strengths;
}