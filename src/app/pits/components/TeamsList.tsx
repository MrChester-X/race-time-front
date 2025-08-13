import { useState } from "react";
import TeamRow from "./TeamRow";
import PlusIcon from "./icons/PlusIcon";
import AddTeamModal from "./AddTeamModal";
import { useRaceStore } from "../store/useRaceStore";

export default function TeamsList() {
  const { teams, addTeam } = useRaceStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddTeam = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const teamName = formData.get('teamName') as string;
    const startKart = formData.get('startKart') as string;

    const success = addTeam(teamName, startKart);
    
    if (!success) {
      alert('Команда с таким номером карта уже существует!');
      return;
    }

    setIsAddModalOpen(false);
    
    // Reset form
    (e.target as HTMLFormElement).reset();
  };

  if (!teams) return null;
  return (
    <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg flex items-center justify-center">
            👥
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Команды</h2>
          <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-white/20 to-transparent ml-4"></div>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <PlusIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Добавить команду</span>
          <span className="sm:hidden">Добавить</span>
        </button>
      </div>
      <div className="flex flex-col justify-center mt-3 w-full">
        {Object.values(teams).map((team, index) => (
          <TeamRow
            key={index}
            team={team}
          />
        ))}
      </div>

      <AddTeamModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTeam}
      />
    </section>
  );
}
