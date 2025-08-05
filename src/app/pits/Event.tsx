import { ParsedRaceEvent } from "@/app/pits/types";
import { Utils } from "@/utils/Utils";

const Event = ({ event }: { event: ParsedRaceEvent }) => {
  if (event.type === "pit") {
    return (
      <div className="p-2 rounded-xl bg-blue-500">
        {/*<Image src="/icons/kart-change.png" alt="icon" width="5" height="5" />*/}
        {event.team.startKart}
        {Utils.getLaneLetter(event.lane)} {event.team.name} (№{event.pitCount}) {event.team.karts[event.pitCount - 1]} {"->"}{" "}
        {event.team.karts[event.pitCount]}
      </div>
    );
  }
};

export default Event;
