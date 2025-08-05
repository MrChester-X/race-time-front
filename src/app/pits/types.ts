export interface RaceEvent {
  type: "pit";
  kart: string;
  lane: number;
}

export interface ParsedRaceEvent {
  type: "pit";
  pitCount: number;
  kart: string;
  lane: number;
  team: ParsedRaceTeam;
}

export interface RaceTeam {
  name: string;
  startKart: string;
}

export interface ParsedRaceTeam {
  name: string;
  startKart: string;
  karts: string[];
}

export interface RaceData {
  events: RaceEvent[];
  teams: RaceTeam[];
  pitlanesCount: number;
  startPitlane: string[][];
}
