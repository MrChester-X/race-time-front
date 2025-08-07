import { ParsedRaceTeam } from "@/app/pits/types";
import Modal from "./Modal";

interface DeleteTeamModalProps {
  isOpen: boolean;
  teamToDelete: ParsedRaceTeam | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteTeamModal({
  isOpen,
  teamToDelete,
  onClose,
  onConfirm,
}: DeleteTeamModalProps) {
  if (!teamToDelete) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Удалить команду"
    >
      <p className="text-gray-300 mb-6">
        Вы уверены, что хотите удалить команду <span className="font-bold text-white">{teamToDelete.name}</span>? 
        Это действие нельзя отменить.
      </p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
        >
          Отмена
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors duration-200"
        >
          Удалить
        </button>
      </div>
    </Modal>
  );
}