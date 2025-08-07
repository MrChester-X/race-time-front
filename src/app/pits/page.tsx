"use client";

import { useEffect } from "react";
import PitsSection from "./components/PitsSection";
import TeamsList from "./components/TeamsList";
import EventsSection from "./components/EventsSection";
import { useRaceStore } from "./store/useRaceStore";

export default function Pits() {
  const {
    raceData,
    pitlane,
    teams,
    events,
    loadInitialData,
  } = useRaceStore();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  if (!raceData || !pitlane || !teams || !events) {
    return <div>Загрузка блин</div>;
  }

  return (
    <div className="flex flex-col gap-20 p-10">
      <PitsSection />
      <TeamsList />
      <EventsSection />
    </div>
  );
}
