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
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>Команды</div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <PlusIcon />
          Добавить команду
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
    </div>
  );
}
