import { RaceData, RaceEvent } from "@/app/pits/types";
import { Utils } from "@/utils/Utils";

const rawEvents =
  "9а 16б 22б 20а 11а 3б 24б 7а 8б 2а 21а 5а 18б 9б 23б 12б 14б 17б 8б 9б 23б 12б 14б 17б 8б 1б 6а 19а 16б 10б 13а 6а 22б 16а 20б 24а 17а 7а 15б 3б 11б 19б 18а 21б 4а 6а 5а 8б 13б 9б 24б 2а 10б 23а 12а 14а 17б 1а 22б 2а 1а 13б 17б 21б 19а 8б 8а 15б 20а 22а 12а 13б 5а 14б 7б 4а 17б 16а 3б 10а 24а 11б 9а 2а 6б 23б 18а 1б 15б 12б 11а 5а 21а 24б 22б 19а 20а 8б 3а 7а 4б 14а 17б 5а 23б 7а 16б 24а 13б 2б 10а 9а 6б 21а 12б 21а 1а 8а 19б 11б 15б 18б 24а 4а 5а 9б 9б";

const rawTeams = {
  "1": "BadBoys Team",
  "2": "EMCO Racing",
  "3": "Team Rocket Turtles",
  "4": "Night Furies Racing",
  "5": "Extreme39",
  "6": "NRG Team by Igora Drive",
  "7": "Ace of Pace",
  "8": "На вираже",
  "9": "Hammer Time Academy",
  "10": "GLADIATORS RT",
  "11": "UWT",
  "12": "MIRA",
  "13": "SR x DTR",
  "14": "MIRA SALUTE",
  "15": "Hammer Time",
  "16": "EX39",
  "17": "Moving Chicanes",
  "18": "Griphunters",
  "19": "Turbo-cherepashki",
  "20": "Автофизкультурники",
  "21": "Tortilla Express",
  "22": "2K2A",
  "23": "MIRA RB",
  "24": "hoba",
};

const parseRawEvent = (rawEvent: string): RaceEvent => {
  const match = /^(\d+)([А-Яа-я])$/.exec(rawEvent);
  if (!match) {
    throw new Error(`Неверный формат строки: "${rawEvent}"`);
  }
  const [, kart, letter] = match;
  return {
    type: "pit",
    kart,
    lane: Utils.getLetterLane(letter),
  };
};

export const TestRaceData: RaceData = {
  teams: Object.entries(rawTeams).map(([startKart, name]) => ({ startKart, name })),
  events: rawEvents.split(" ").map((rawEvent) => parseRawEvent(rawEvent)),
  pitlanesCount: 2,
  startPitlane: [
    ["101", "102"],
    ["103", "104"],
  ],
  kartColors: {},
};
