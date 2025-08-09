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

  // Undo functionality
  undoHistory: RaceData[];

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

  // Undo functionality
  undoLastAction: () => boolean;

  // Data management actions
  clearRaceData: () => void;
  loadTestData: () => void;
}

export const useRaceStore = create<RaceStore>((set, get) => ({
  // Initial state
  raceData: null,
  pitlane: null,
  teams: null,
  events: null,
  focusKart: null,
  undoHistory: [],

  // Core data actions
  setRaceData: (data: RaceData) => {
    // Убеждаемся что у данных есть kartColors
    data = {
      ...data,
      kartColors: data.kartColors || {},
    };

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
    });
  },

  loadInitialData: () => {
    const rawRaceData = localStorage.getItem("raceData");
    const raceData = rawRaceData ? (JSON.parse(rawRaceData) as RaceData) || TestRaceData : TestRaceData;
    get().setRaceData(raceData);
  },

  saveRaceData: () => {
    const { raceData } = get();
    if (raceData) {
      console.log(raceData);
      localStorage.setItem("raceData", JSON.stringify(raceData));
    }
  },

  // Kart actions
  setFocusKart: (kart: string | null) => set({ focusKart: kart }),

  setKartColors: (colors: { [kart: string]: number }) => {
    const { raceData } = get();
    if (raceData) {
      const updatedRaceData = {
        ...raceData,
        kartColors: colors,
      };
      set({ raceData: updatedRaceData });
      get().saveRaceData();
    }
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
    const { raceData, undoHistory } = get();
    if (!raceData) return false;

    // Check if team exists
    const team = raceData.teams.find((t) => t.startKart === kart);
    if (!team) return false;

    // Save current state to undo history before making changes
    const newUndoHistory = [structuredClone(raceData), ...undoHistory.slice(0, 2)]; // Keep only last 3 states

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

    set({ undoHistory: newUndoHistory });
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

  // Undo functionality
  undoLastAction: (): boolean => {
    const { undoHistory } = get();
    if (undoHistory.length === 0) return false;

    const previousState = undoHistory[0];
    const newUndoHistory = undoHistory.slice(1);

    set({ undoHistory: newUndoHistory });
    get().setRaceData(previousState);
    get().saveRaceData();
    return true;
  },

  // Data management actions
  clearRaceData: () => {
    const { raceData } = get();
    if (!raceData) return;

    const clearedData: RaceData = {
      ...raceData,
      events: [],
      teams: [],
      kartColors: {}, // Специально сбрасываем цвета при очистке
    };

    set({ undoHistory: [] }); // Очищаем историю отмены
    get().setRaceData(clearedData);
    get().saveRaceData();
  },

  loadTestData: () => {
    get().setRaceData(TestRaceData);
    get().saveRaceData();
  },
}));
