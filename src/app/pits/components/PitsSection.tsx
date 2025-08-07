import Kart from "@/app/pits/Kart";
import { Utils } from "@/utils/Utils";
import { useRaceStore } from "../store/useRaceStore";

export default function PitsSection() {
  const { pitlane } = useRaceStore();

  if (!pitlane) return null;
  return (
    <div className="flex flex-col gap-3">
      <div>Питы</div>
      <div className="flex flex-col gap-3">
        {pitlane.map((row, index) => (
          <div key={index} className="flex flex-row gap-3 items-center">
            <div>
              {Utils.getLaneLetter(index)} {"<"}{" "}
            </div>
            {row.map((kart, index) => (
              <Kart key={index} kart={kart} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
