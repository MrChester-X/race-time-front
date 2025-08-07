import Event from "@/app/pits/Event";
import { useRaceStore } from "../store/useRaceStore";

export default function EventsSection() {
  const { events } = useRaceStore();

  if (!events) return null;
  return (
    <div className="flex flex-col gap-5">
      <div>События</div>
      <div className="flex flex-row gap-2 flex-wrap">
        {events.map((event, index) => (
          <Event event={event} key={index} />
        ))}
      </div>
    </div>
  );
}