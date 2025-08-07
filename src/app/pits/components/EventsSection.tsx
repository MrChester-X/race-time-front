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
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-400 rounded-lg flex items-center justify-center">⚡</div>
          <h2 className="text-xl font-bold text-white">События</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent ml-4"></div>
        </div>
        <div className="text-sm text-gray-400">Всего: {events.length} • Показаны сначала новые</div>
      </div>

      <div className="space-y-6">
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

        {/* Events grid - только события */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {reversedEvents.map((event, displayIndex) => {
              const originalIndex = events.length - 1 - displayIndex;
              return (
                <div key={`event-${originalIndex}`} className="relative group/event">
                  <Event event={event} eventIndex={originalIndex} eventNumber={reversedEvents.length - displayIndex} />
                  {/* Floating add button after each event (except last) */}
                  {displayIndex < reversedEvents.length - 1 && (
                    <button
                      onClick={() => handleAddEvent(originalIndex)}
                      className="absolute -bottom-2 -right-2 w-6 h-6 bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white rounded-full transition-all duration-200 border border-dashed border-gray-600 hover:border-gray-500 flex items-center justify-center opacity-70 hover:opacity-100 z-10"
                      title={`Добавить событие после #${reversedEvents.length - displayIndex}`}
                    >
                      <PlusIcon className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Floating add button for adding to start */}
          {events.length > 0 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => handleAddEvent(0)}
                className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-full transition-all duration-200 border border-dashed border-gray-600 hover:border-gray-500 flex items-center justify-center"
                title="Добавить событие в начало"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <AddEventModal isOpen={isAddModalOpen} insertIndex={insertIndex} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
