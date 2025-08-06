"use client";

import { useEffect, useState } from "react";
import { TestRaceData } from "@/app/pits/const/TestRaceData";
import { ParsedRaceEvent, ParsedRaceTeam, RaceData } from "@/app/pits/types";
import Event from "@/app/pits/Event";
import Kart from "@/app/pits/Kart";
import { Utils } from "@/utils/Utils";

const processPitlane = (pitlane: string[][], lane: number, team: ParsedRaceTeam) => {
  pitlane[lane].push(team.karts.at(-1) as string);
  team.karts.push(pitlane[lane][0]);
  pitlane[lane].shift();
};

export default function Pits() {
  const [raceData, setRaceData] = useState<RaceData | null>(null);
  const [pitlane, setPitlane] = useState<string[][] | null>();
  const [teams, setTeams] = useState<{ [startKart: string]: ParsedRaceTeam } | null>(null);
  const [events, setEvents] = useState<ParsedRaceEvent[] | null>(null);

  const [focusKart, setFocusKart] = useState<string | null>(null);
  const [kartColors, setKartColors] = useState<{ [kart: string]: number }>({});

  const saveRaceData = () => {
    console.log(raceData);
    localStorage.setItem("raceData", JSON.stringify(raceData));
  };

  useEffect(() => {
    if (!raceData) {
      return;
    }
    const newTeams: { [startKart: string]: ParsedRaceTeam } = structuredClone(raceData.teams).reduce(
      (acc, team) => ({
        ...acc,
        [team.startKart]: { ...team, karts: [team.startKart] },
      }),
      {},
    );
    const newPitlane = structuredClone(raceData.startPitlane);
    const newEvents: ParsedRaceEvent[] = [];
    for (const event of raceData.events) {
      if (event.type === "pit") {
        const team = newTeams[event.kart];
        processPitlane(newPitlane, event.lane, team);
        newEvents.push({ ...event, team, pitCount: team.karts.length - 1 });
      }
    }
    setTeams(newTeams);
    setPitlane(newPitlane);
    setEvents(newEvents);
  }, [raceData]);

  useEffect(() => {
    const rawRaceData = localStorage.getItem("raceData");
    const raceData = rawRaceData ? (JSON.parse(rawRaceData) as RaceData) || TestRaceData : TestRaceData;
    setRaceData(raceData);
  }, []);

  useEffect(() => {
    saveRaceData();
  }, [raceData]);

  if (!raceData || !pitlane || !teams || !events) {
    return <div>Загрузка блин</div>;
  }

  return (
    <div className="flex flex-col gap-20 p-10">
      <div className="flex flex-col gap-3">
        <div>Питы</div>
        <div className="flex flex-col gap-3">
          {pitlane.map((row, index) => (
            <div key={index} className="flex flex-row gap-3 items-center">
              <div>
                {Utils.getLaneLetter(index)} {"<"}{" "}
              </div>
              {row.map((kart, index) => (
                <Kart
                  key={index}
                  kart={kart}
                  focusKart={focusKart}
                  setFocusKart={setFocusKart}
                  kartColors={kartColors}
                  setKartColors={setKartColors}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div>Команды</div>
        <div className="flex flex-col gap-3 mt-3 w-full">
          {Object.values(teams).map((team, index) => (
            <div className="flex flex-row h-9 border-b border-gray-500 w-full" key={index}>
              <div className="mr-5 text-[#faef66] font-bold">{team.karts[0].padStart(2, "0")}</div>
              <div className="w-[200px] flex-none mr-5 font-bold overflow-hidden whitespace-nowrap">{team.name}</div>
              {team.karts.map((kart, index) => (
                <div className="mr-3" key={index}>
                  <Kart
                    focusKart={focusKart}
                    setFocusKart={setFocusKart}
                    kart={kart}
                    kartColors={kartColors}
                    setKartColors={setKartColors}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div>События</div>
        <div className="flex flex-row gap-2 flex-wrap">
          {events.map((event, index) => (
            <Event event={event} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
