import { create } from "zustand";
import { ParsedRaceEvent, ParsedRaceTeam, RaceData, RaceTeam } from "@/app/pits/types";
import { TestRaceData } from "@/app/pits/const/TestRaceData";

const processPitlane = (pitlane: string[][], lane: number, team: ParsedRaceTeam) => {
  pitlane[lane].push(team.karts.at(-1) as string);
  team.karts.push(pitlane[lane][0]);
  pitlane[lane].shift();
};

interface RaceStore {
  // Core race data
  raceData: RaceData | null;
  pitlane: string[][] | null;
  teams: { [startKart: string]: ParsedRaceTeam } | null;
  events: ParsedRaceEvent[] | null;

  // UI state
  focusKart: string | null;
  kartColors: { [kart: string]: number };

  // Actions
  setRaceData: (data: RaceData) => void;
  loadInitialData: () => void;
  saveRaceData: () => void;

  // Kart actions
  setFocusKart: (kart: string | null) => void;
  setKartColors: (colors: { [kart: string]: number }) => void;

  // Team actions
  addTeam: (name: string, startKart: string) => boolean;
  deleteTeam: (team: ParsedRaceTeam) => void;

  // Event actions
  addEvent: (kart: string, lane: number, insertIndex: number) => boolean;
  deleteEvent: (eventIndex: number) => void;
}

export const useRaceStore = create<RaceStore>((set, get) => ({
  // Initial state
  raceData: null,
  pitlane: null,
  teams: null,
  events: null,
  focusKart: null,
  kartColors: {},

  // Core data actions
  setRaceData: (data: RaceData) => {
    set({ raceData: data });

    // Process the data
    const newTeams: { [startKart: string]: ParsedRaceTeam } = structuredClone(data.teams).reduce(
      (acc, team) => ({
        ...acc,
        [team.startKart]: { ...team, karts: [team.startKart] },
      }),
      {},
    );

    const newPitlane = structuredClone(data.startPitlane);
    const newEvents: ParsedRaceEvent[] = [];

    for (const event of data.events) {
      if (event.type === "pit") {
        const team = newTeams[event.kart];
        processPitlane(newPitlane, event.lane, team);
        newEvents.push({ ...event, team, pitCount: team.karts.length - 1 });
      }
    }

    set({
      raceData: data,
      teams: newTeams,
      pitlane: newPitlane,
      events: newEvents,
      kartColors: data.kartColors || {},
    });
  },

  loadInitialData: () => {
    const rawRaceData = localStorage.getItem("raceData");
    const raceData = rawRaceData ? (JSON.parse(rawRaceData) as RaceData) || TestRaceData : TestRaceData;
    get().setRaceData(raceData);
  },

  saveRaceData: () => {
    const { raceData, kartColors } = get();
    if (raceData) {
      const dataToSave = {
        ...raceData,
        kartColors,
      };
      console.log(dataToSave);
      localStorage.setItem("raceData", JSON.stringify(dataToSave));
    }
  },

  // Kart actions
  setFocusKart: (kart: string | null) => set({ focusKart: kart }),

  setKartColors: (colors: { [kart: string]: number }) => {
    set({ kartColors: colors });
    // Auto-save race data with updated kart colors
    get().saveRaceData();
  },

  // Team actions
  addTeam: (name: string, startKart: string): boolean => {
    const { raceData } = get();
    if (!raceData || !name || !startKart) return false;

    // Check if team with this start kart already exists
    if (raceData.teams.find((team) => team.startKart === startKart)) {
      return false; // Team already exists
    }

    const newTeam: RaceTeam = {
      name: name.trim(),
      startKart: startKart.trim(),
    };

    const updatedRaceData = {
      ...raceData,
      teams: [...raceData.teams, newTeam],
    };

    get().setRaceData(updatedRaceData);
    get().saveRaceData();
    return true; // Success
  },

  deleteTeam: (team: ParsedRaceTeam) => {
    const { raceData } = get();
    if (!raceData) return;

    const updatedRaceData = {
      ...raceData,
      teams: raceData.teams.filter((t) => t.startKart !== team.startKart),
      events: raceData.events.filter((event) => event.kart !== team.startKart),
    };

    get().setRaceData(updatedRaceData);
    get().saveRaceData();
  },

  // Event actions
  addEvent: (kart: string, lane: number, insertIndex: number): boolean => {
    const { raceData } = get();
    if (!raceData) return false;

    // Check if team exists
    const team = raceData.teams.find((t) => t.startKart === kart);
    if (!team) return false;

    const newEvent = {
      type: "pit" as const,
      kart,
      lane,
    };

    const newEvents = [...raceData.events];
    
    if (insertIndex === -1) {
      // Add to the end
      newEvents.push(newEvent);
    } else {
      // Insert at specific position
      newEvents.splice(insertIndex, 0, newEvent);
    }

    const updatedRaceData = {
      ...raceData,
      events: newEvents,
    };

    get().setRaceData(updatedRaceData);
    get().saveRaceData();
    return true;
  },

  deleteEvent: (eventIndex: number) => {
    const { raceData } = get();
    if (!raceData || eventIndex < 0 || eventIndex >= raceData.events.length) return;

    const newEvents = [...raceData.events];
    newEvents.splice(eventIndex, 1);

    const updatedRaceData = {
      ...raceData,
      events: newEvents,
    };

    get().setRaceData(updatedRaceData);
    get().saveRaceData();
  },
}));
