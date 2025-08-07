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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Добавить событие ${insertIndex === 0 ? "в начало" : insertIndex === -1 ? "в конец" : `на позицию ${insertIndex + 1}`}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="teamKart" className="block text-sm font-medium text-gray-300 mb-2">
            Команда (стартовый карт)
          </label>
          <select
            id="teamKart"
            value={teamKart}
            onChange={(e) => setTeamKart(e.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Выберите команду...</option>
            {Object.values(teams).map((team) => (
              <option key={team.startKart} value={team.startKart}>
                {team.startKart.padStart(2, "0")} - {team.name}
              </option>
            ))}
          </select>
        </div>

        {raceData.pitlanesCount > 1 && (
          <div>
            <label htmlFor="lane" className="block text-sm font-medium text-gray-300 mb-2">
              Питлейн
            </label>
            <select
              id="lane"
              value={lane}
              onChange={(e) => setLane(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Array.from({ length: raceData.pitlanesCount }, (_, i) => (
                <option key={i} value={i}>
                  Питлейн {String.fromCharCode(65 + i)} ({i + 1})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors duration-200"
          >
            Добавить
          </button>
        </div>
      </form>
    </Modal>
  );
}