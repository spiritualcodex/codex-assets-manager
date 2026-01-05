export interface PlayerAttributes {
  attack: number;
  defense: number;
  stamina: number;
  technique: number;
  pace: number;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  attributes: PlayerAttributes;
  form: number; // 0.0 to 1.0
  morale: number; // 0.0 to 1.0
  matchStats?: {
    goals: number;
    assists: number;
    tackles: number;
    passesCompleted: number;
    distanceRun: number;
  };
}