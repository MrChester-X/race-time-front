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
    <>
      {/* Desktop layout */}
      <div className="hidden sm:flex flex-row min-h-11 border-b border-gray-500 w-full relative py-2">
        {/* Text zone - bottom aligned */}
        <div className="flex items-center">
          <div className="mr-4 w-8 text-[#faef66] font-bold text-sm">{team.karts[0].padStart(2, "0")}</div>
          <div className="w-48 flex-none mr-4 font-bold overflow-hidden whitespace-nowrap text-sm">{team.name}</div>
        </div>

        {/* Karts zone - center aligned */}
        <div className="flex-1 flex items-center justify-start flex-wrap gap-2">
          {team.karts.toReversed().map((kart, index) => (
            <div key={index}>
              <Kart kart={kart} />
            </div>
          ))}
        </div>

        {/* Delete button zone - center aligned */}
        <div className="flex items-center">
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
            title="Удалить команду"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="sm:hidden border-b border-gray-500 w-full relative p-3">
        {/* Header with team number, name and delete button */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#faef66] text-black font-bold text-sm rounded-lg flex items-center justify-center">
              {team.karts[0].padStart(2, "0")}
            </div>
            <div className="font-bold text-white text-sm">{team.name}</div>
          </div>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
            title="Удалить команду"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Karts grid for mobile */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {team.karts.map((kart, index) => (
            <div key={index} className="flex justify-center">
              <Kart kart={kart} />
            </div>
          ))}
        </div>
      </div>

      <DeleteTeamModal
        isOpen={isDeleteModalOpen}
        teamToDelete={team}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
