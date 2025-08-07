import { ParsedRaceEvent } from "@/app/pits/types";
import { Utils } from "@/utils/Utils";
import ArrowLeftIcon from "./icons/ArrowLeftIcon";
import Kart from "@/app/pits/Kart";
import { useRaceStore } from "../store/useRaceStore";

interface PitlaneVisualizationProps {
  event: ParsedRaceEvent;
  eventIndex: number;
}

export default function PitlaneVisualization({ event, eventIndex }: PitlaneVisualizationProps) {
  const { raceData } = useRaceStore();
  
  if (!raceData) return null;

  // Рассчитываем состояние питлейна ДО этого события
  const calculatePitlaneStateBefore = () => {
    const pitlane = structuredClone(raceData.startPitlane);
    const teams: { [startKart: string]: string[] } = {};
    
    // Инициализируем команды
    raceData.teams.forEach(team => {
      teams[team.startKart] = [team.startKart];
    });
    
    // Применяем все события ДО текущего (не включая)
    for (let i = 0; i < eventIndex; i++) {
      const prevEvent = raceData.events[i];
      if (prevEvent.type === "pit") {
        const team = teams[prevEvent.kart];
        if (team) {
          // Процесс пит-стопа
          pitlane[prevEvent.lane].push(team.at(-1) as string);
          team.push(pitlane[prevEvent.lane][0]);
          pitlane[prevEvent.lane].shift();
        }
      }
    }
    
    return pitlane;
  };

  const pitlaneBefore = calculatePitlaneStateBefore();

  return (
    <div className="mt-4 p-3 bg-blue-800/20 rounded-lg border border-blue-700/30">
      <div className="text-blue-200 text-xs font-medium mb-3">
        Состояние питлейна до въезда:
      </div>
      
      <div className="space-y-2">
        {pitlaneBefore.map((lane, laneIndex) => (
          <div 
            key={laneIndex}
            className={`
              flex items-center gap-3 p-2 rounded transition-all
              ${laneIndex === event.lane 
                ? 'bg-yellow-500/20 border border-yellow-500/50' 
                : 'bg-blue-700/20'
              }
            `}
          >
            {/* Название питлейна */}
            <div className={`
              font-bold text-sm min-w-[20px]
              ${laneIndex === event.lane ? 'text-yellow-200' : 'text-blue-200'}
            `}>
              {Utils.getLaneLetter(laneIndex)}
            </div>
            
            {/* Стрелка направления */}
            <ArrowLeftIcon className={`
              w-4 h-4 
              ${laneIndex === event.lane ? 'text-yellow-300' : 'text-blue-300'}
            `} />
            
            {/* Карты в очереди */}
            <div className="flex items-center gap-1 flex-1">
              {lane.length === 0 ? (
                <span className="text-blue-400 text-xs italic">пусто</span>
              ) : (
                lane.map((kart, kartIndex) => (
                  <div key={kartIndex} className="mr-1">
                    <Kart kart={kart} />
                  </div>
                ))
              )}
              
              {/* Призрачный кружок для въезжающего карта */}
              {laneIndex === event.lane && (
                <div className="mr-1">
                  <Kart kart={event.team.karts[event.pitCount - 1]} isGhost={true} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}