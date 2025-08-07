import { useState } from "react";
import Event from "@/app/pits/Event";
import PlusIcon from "./icons/PlusIcon";
import AddEventModal from "./AddEventModal";
import { useRaceStore } from "../store/useRaceStore";

export default function EventsSection() {
  const { events } = useRaceStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [insertIndex, setInsertIndex] = useState(-1);

  const handleAddEvent = (index: number) => {
    setInsertIndex(index);
    setIsAddModalOpen(true);
  };

  if (!events) return null;

  // Reverse events to show latest first
  const reversedEvents = [...events].reverse();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>События</div>
        <div className="text-sm text-gray-500">
          Всего: {events.length} • Показаны сначала новые
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
        {/* Add button before first event */}
        <div className="flex justify-center">
          <button
            onClick={() => handleAddEvent(-1)}
            className="group flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-all duration-200 border-2 border-dashed border-gray-600 hover:border-gray-500"
            title="Добавить событие в конец"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="text-sm">Добавить событие</span>
          </button>
        </div>

        {/* Events with add buttons between them */}
        {reversedEvents.map((event, displayIndex) => {
          const originalIndex = events.length - 1 - displayIndex;
          return (
            <div key={originalIndex} className="flex flex-col items-center gap-4">
              <Event event={event} eventIndex={originalIndex} />
              
              {/* Add button between events */}
              {displayIndex < reversedEvents.length - 1 && (
                <button
                  onClick={() => handleAddEvent(originalIndex)}
                  className="group p-2 bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white rounded-full transition-all duration-200 border-2 border-dashed border-gray-600 hover:border-gray-500"
                  title={`Добавить событие после ${reversedEvents.length - displayIndex}`}
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}

        {/* Add button after last event (chronologically first) */}
        {events.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={() => handleAddEvent(0)}
              className="group flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-all duration-200 border-2 border-dashed border-gray-600 hover:border-gray-500"
              title="Добавить событие в начало"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="text-sm">Добавить в начало</span>
            </button>
          </div>
        )}
      </div>

      <AddEventModal
        isOpen={isAddModalOpen}
        insertIndex={insertIndex}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}