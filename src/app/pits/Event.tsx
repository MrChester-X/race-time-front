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
}

const Event = ({ event, eventIndex }: EventProps) => {
  const { deleteEvent } = useRaceStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteConfirm = () => {
    deleteEvent(eventIndex);
    setIsDeleteModalOpen(false);
  };

  if (event.type === "pit") {
    return (
      <>
        <div className="group relative bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 min-w-[400px] max-w-[500px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <KartChangeIcon className="w-5 h-5 text-blue-100" />
              <span className="text-blue-100 font-medium">Пит-стоп #{event.pitCount}</span>
            </div>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="opacity-0 group-hover:opacity-100 p-1 text-blue-200 hover:text-red-300 hover:bg-red-500/20 rounded transition-all duration-200"
              title="Удалить событие"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Team info */}
          <div className="mb-3">
            <div className="text-white font-bold text-lg">
              <span className="text-yellow-300">{event.team.startKart.padStart(2, "0")}</span> {event.team.name}
            </div>
            <div className="text-blue-100 text-sm">
              Питлейн {Utils.getLaneLetter(event.lane)} • Команда #{event.team.startKart.padStart(2, "0")}
            </div>
          </div>

          {/* Kart change */}
          <div className="flex items-center justify-center gap-3 bg-blue-700/30 rounded-lg p-3">
            <div className="text-center flex flex-col items-center">
              <div className="text-blue-200 text-xs mb-1">Заезжает</div>
              <Kart kart={event.team.karts[event.pitCount - 1]} />
            </div>
            <KartChangeIcon className="w-6 h-6 text-blue-200" />
            <div className="text-center flex flex-col items-center">
              <div className="text-blue-200 text-xs mb-1">Выезжает</div>
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
