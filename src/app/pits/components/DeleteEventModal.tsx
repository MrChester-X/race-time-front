import { ParsedRaceEvent } from "@/app/pits/types";
import Modal from "./Modal";

interface DeleteEventModalProps {
  isOpen: boolean;
  eventToDelete: ParsedRaceEvent | null;
  eventIndex: number;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteEventModal({
  isOpen,
  eventToDelete,
  eventIndex,
  onClose,
  onConfirm,
}: DeleteEventModalProps) {
  if (!eventToDelete) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Удалить событие"
    >
      <div className="text-gray-300 mb-6">
        <p className="mb-3">Вы уверены, что хотите удалить это событие?</p>
        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="text-sm text-gray-400">Событие #{eventIndex + 1}:</div>
          <div className="font-medium text-white">
            {eventToDelete.team.name} - Пит #{eventToDelete.pitCount}
          </div>
          <div className="text-sm text-gray-400">
            Карт {eventToDelete.team.karts[eventToDelete.pitCount - 1]} → {eventToDelete.team.karts[eventToDelete.pitCount]}
          </div>
        </div>
        <p className="mt-3 text-sm text-yellow-400">
          ⚠️ Это действие нельзя отменить и может повлиять на последующие события.
        </p>
      </div>
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