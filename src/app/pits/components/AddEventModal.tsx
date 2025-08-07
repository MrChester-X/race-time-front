import { useState } from "react";
import Modal from "./Modal";
import { useRaceStore } from "../store/useRaceStore";

interface AddEventModalProps {
  isOpen: boolean;
  insertIndex: number;
  onClose: () => void;
}

export default function AddEventModal({
  isOpen,
  insertIndex,
  onClose,
}: AddEventModalProps) {
  const { teams, raceData, addEvent } = useRaceStore();
  const [teamKart, setTeamKart] = useState("");
  const [lane, setLane] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teamKart.trim()) {
      alert("Выберите команду!");
      return;
    }

    const success = addEvent(teamKart.trim(), lane, insertIndex);
    
    if (!success) {
      alert("Ошибка добавления события. Проверьте корректность данных.");
      return;
    }

    setTeamKart("");
    setLane(0);
    onClose();
  };

  if (!teams || !raceData) return null;

  const getPositionText = () => {
    if (insertIndex === 0) return "в начало";
    if (insertIndex === -1) return "в конец";
    return `на позицию ${insertIndex + 1}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Добавить событие</h2>
        <div className="text-blue-300 mb-8 text-lg">
          {getPositionText()}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            <div>
              <label htmlFor="teamKart" className="block text-lg font-medium text-gray-300 mb-3 text-left">
                Команда (стартовый карт)
              </label>
              <select
                id="teamKart"
                value={teamKart}
                onChange={(e) => setTeamKart(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Выберите команду...</option>
                {Object.values(teams).map((team) => (
                  <option key={team.startKart} value={team.startKart}>
                    #{team.startKart.padStart(2, "0")} - {team.name}
                  </option>
                ))}
              </select>
            </div>

            {raceData.pitlanesCount > 1 && (
              <div>
                <label htmlFor="lane" className="block text-lg font-medium text-gray-300 mb-3 text-left">
                  Питлейн
                </label>
                <select
                  id="lane"
                  value={lane}
                  onChange={(e) => setLane(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from({ length: raceData.pitlanesCount }, (_, i) => (
                    <option key={i} value={i}>
                      Питлейн {String.fromCharCode(65 + i)} ({i + 1})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 text-gray-300 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors duration-200 min-w-[120px]"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 min-w-[120px]"
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}