"use client";

import { useEffect, useState } from "react";
import PitsSection from "./components/PitsSection";
import TeamsList from "./components/TeamsList";
import EventsSection from "./components/EventsSection";
import APLogo from "./components/icons/APLogo";
import RefreshIcon from "./components/icons/RefreshIcon";
import TrashAllIcon from "./components/icons/TrashAllIcon";
import ClearDataModal from "./components/ClearDataModal";
import LoadTestDataModal from "./components/LoadTestDataModal";
import { useRaceStore } from "./store/useRaceStore";

export default function Pits() {
  const { raceData, pitlane, teams, events, loadInitialData, clearRaceData, loadTestData } = useRaceStore();
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isLoadTestModalOpen, setIsLoadTestModalOpen] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleClearData = () => {
    clearRaceData();
    setIsClearModalOpen(false);
  };

  const handleLoadTestData = () => {
    loadTestData();
    setIsLoadTestModalOpen(false);
  };

  if (!raceData || !pitlane || !teams || !events) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <div className="text-white text-lg font-medium">Загрузка данных гонки...</div>
          <div className="text-orange-300 text-sm mt-2">Подготовка питлейна и команд</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <APLogo width={32} height={32} className="rounded-lg shadow-lg" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">Ace of Pace - Controlling Panel</h1>
                <p className="text-orange-300 text-xs sm:text-sm">Обогнать грипов сквозь дождь и кучу дров</p>
              </div>
            </div>
            
            {/* Stats - скрыты на малых экранах, показаны на планшетах и больше */}
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-300">
              <div>Команды: {Object.keys(teams).length}</div>
              <div className="text-gray-400">|</div>
              <div>События: {events.length}</div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <a
                href="/pits/focus"
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 text-xs font-bold"
                title="Переключиться в Режим волны"
              >
                <span className="hidden sm:inline">⚡</span>
                <span className="text-xs sm:text-xs">РЕЖИМ ВОЛНЫ</span>
              </a>
              <button
                onClick={() => setIsLoadTestModalOpen(true)}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors duration-200 text-xs"
                title="Загрузить тестовые данные"
              >
                <RefreshIcon className="w-3 h-3" />
                <span className="hidden sm:inline">Тест</span>
              </button>
              <button
                onClick={() => setIsClearModalOpen(true)}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 text-xs"
                title="Очистить все данные"
              >
                <TrashAllIcon className="w-3 h-3" />
                <span className="hidden sm:inline">Очистить</span>
              </button>
            </div>
          </div>
          
          {/* Mobile stats */}
          <div className="md:hidden flex items-center justify-center gap-4 text-xs text-gray-400 mt-2 pt-2 border-t border-white/10">
            <div>Команды: {Object.keys(teams).length}</div>
            <div>•</div>
            <div>События: {events.length}</div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col gap-8 sm:gap-12 lg:gap-16">
          <PitsSection />
          <TeamsList />
          <EventsSection />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-8 sm:mt-16 bg-black/20 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 text-center text-gray-400 text-xs sm:text-sm">
          <div className="flex items-center justify-center gap-2">
            <span>Ace of Pace</span>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <span>Controlling Panel</span>
          </div>
        </div>
      </footer>

        {/* Modals */}
        <ClearDataModal
          isOpen={isClearModalOpen}
          onClose={() => setIsClearModalOpen(false)}
          onConfirm={handleClearData}
        />
        <LoadTestDataModal
          isOpen={isLoadTestModalOpen}
          onClose={() => setIsLoadTestModalOpen(false)}
          onConfirm={handleLoadTestData}
        />
      </div>
    );
  }
