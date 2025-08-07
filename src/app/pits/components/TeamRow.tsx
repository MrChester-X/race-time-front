import { useState } from "react";
import { ParsedRaceTeam } from "@/app/pits/types";
import Kart from "@/app/pits/Kart";
import TrashIcon from "./icons/TrashIcon";
import DeleteTeamModal from "./DeleteTeamModal";
import { useRaceStore } from "../store/useRaceStore";

interface TeamRowProps {
  team: ParsedRaceTeam;
}

export default function TeamRow({ team }: TeamRowProps) {
  const { deleteTeam } = useRaceStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteConfirm = () => {
    deleteTeam(team);
    setIsDeleteModalOpen(false);
  };
  return (
    <div className="flex flex-row h-11 border-b border-gray-500 w-full relative">
      {/* Text zone - bottom aligned */}
      <div className="flex items-end pb-1">
        <div className="mr-5 w-[35px] text-[#faef66] font-bold">{team.karts[0].padStart(2, "0")}</div>
        <div className="w-[200px] flex-none mr-5 font-bold overflow-hidden whitespace-nowrap">{team.name}</div>
      </div>

      {/* Karts zone - center aligned */}
      <div className="flex-1 flex items-center justify-start">
        {team.karts.map((kart, index) => (
          <div className="mr-3" key={index}>
            <Kart kart={kart} />
          </div>
        ))}
      </div>

      {/* Delete button zone - center aligned */}
      <div className="flex items-center">
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
          title="Удалить команду"
        >
          <TrashIcon />
        </button>
      </div>

      <DeleteTeamModal
        isOpen={isDeleteModalOpen}
        teamToDelete={team}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
