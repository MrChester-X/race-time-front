import { ChangeEvent, useEffect, useState } from "react";
import { Race } from "@/app/video/classes/race.class";
import axios from "axios";
import { RaceDto } from "@/app/video/dto/RaceDto";

const RaceElement = ({ setRace }: { setRace: (race: Race) => void | Race }) => {
  const [elementRace, setElementRace] = useState<Race | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [pitlane, setPitlane] = useState<string[]>([]);

  const handleUrl = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.currentTarget.value);
  };
  const handlePitlane = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.currentTarget.value.split(" "));
    setPitlane(e.currentTarget.value.split(" "));
  };

  useEffect(() => {
    const handle = async () => {
      if (!url) {
        return;
      }
      console.log(url);
      console.log(pitlane);
      const raceDto = (
        await axios.get(`http://localhost:3010/parser/race`, {
          params: {
            url,
            pitlane: pitlane.join(" "),
          },
        })
      ).data as RaceDto;
      const race = Race.fromDto(raceDto);
      const newRace = setRace(race);
      if (newRace) {
        setElementRace(newRace);
      } else {
        setElementRace(race);
      }
    };
    const interval = setInterval(() => handle().catch(console.error), 1e3);
    handle().catch(console.error);
    return () => clearInterval(interval);
  }, [url, pitlane]);

  return (
    <div className="flex flex-col gap-5 w-fit border-2 rounded-xl p-5 whitespace-pre-wrap">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input className="text-black w-[450px]" accept="text" onChange={handleUrl} placeholder="" />
          <div>Ссылка на заезд/трассу</div>
        </div>
        <div className="flex gap-2">
          <input className="text-black w-[450px]" accept="text" onChange={handlePitlane} placeholder="" />
          <div>Карты в питах</div>
        </div>
        <div>{elementRace && elementRace.drivers.map((driver) => `${driver.name} ${driver.getKarts().join(" -> ")}`).join("\n")}</div>
      </div>
      <div>Питы: {elementRace && elementRace.getPitlane().join(", ")}</div>
    </div>
  );
};

export default RaceElement;
