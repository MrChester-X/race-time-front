import { useState } from "react";
import { ParsedRaceEvent } from "@/app/pits/types";
import { Utils } from "@/utils/Utils";
import KartChangeIcon from "./components/icons/KartChangeIcon";
import TrashIcon from "./components/icons/TrashIcon";
import DeleteEventModal from "./components/DeleteEventModal";
import PitlaneVisualization from "./components/PitlaneVisualization";
import Kart from "./Kart";
import { useRaceStore } from "./store/useRaceStore";

interface EventProps {
  event: ParsedRaceEvent;
  eventIndex: number;
  eventNumber: number;
}

const Event = ({ event, eventIndex, eventNumber }: EventProps) => {
  const { deleteEvent } = useRaceStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteConfirm = () => {
    deleteEvent(eventIndex);
    setIsDeleteModalOpen(false);
  };

  if (event.type === "pit") {
    return (
      <>
        <div className="group relative bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-xl p-3 shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-200 w-full overflow-hidden">
          {/* Event number badge in corner */}
          <div className="absolute top-0 right-0 bg-red-800/90 text-orange-100 text-xs font-bold px-2 py-1 rounded-bl-lg backdrop-blur-sm">
            #{eventNumber}
          </div>

          {/* Delete button in top-left corner */}
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 p-1 text-orange-200 hover:text-red-300 hover:bg-red-500/20 rounded transition-all duration-200 z-10"
            title="Удалить событие"
          >
            <TrashIcon className="w-3 h-3" />
          </button>

          {/* Header */}
          <div className="flex items-center justify-center mb-2">
            <div className="flex items-center gap-1.5">
              <KartChangeIcon className="w-4 h-4 text-orange-100" />
              <span className="text-orange-100 font-medium text-sm">Пит #{event.pitCount}</span>
            </div>
          </div>

          {/* Team info */}
          <div className="mb-2">
            <div className="text-white font-bold text-base">
              <span className="text-yellow-300">{event.team.startKart.padStart(2, "0")}</span> {event.team.name}
            </div>
            <div className="text-orange-100 text-xs">
              Питлейн {Utils.getLaneLetter(event.lane)} • Команда #{event.team.startKart.padStart(2, "0")}
            </div>
          </div>

          {/* Kart change */}
          <div className="flex items-center justify-center gap-2 bg-red-700/30 rounded-lg p-2">
            <div className="text-center flex flex-col items-center">
              <div className="text-orange-200 text-xs mb-1">Заезжает</div>
              <Kart kart={event.team.karts[event.pitCount - 1]} />
            </div>
            <KartChangeIcon className="w-5 h-5 text-orange-200" />
            <div className="text-center flex flex-col items-center">
              <div className="text-orange-200 text-xs mb-1">Выезжает</div>
              <Kart kart={event.team.karts[event.pitCount]} />
            </div>
          </div>

          {/* Pitlane visualization */}
          <PitlaneVisualization event={event} eventIndex={eventIndex} />
        </div>

        <DeleteEventModal
          isOpen={isDeleteModalOpen}
          eventToDelete={event}
          eventIndex={eventIndex}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      </>
    );
  }

  return null;
};

export default Event;
