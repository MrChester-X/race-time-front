import Modal from "./Modal";

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function AddTeamModal({
  isOpen,
  onClose,
  onSubmit,
}: AddTeamModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Добавить команду"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="teamName" className="block text-sm font-medium text-gray-300 mb-1">
            Название команды
          </label>
          <input
            type="text"
            id="teamName"
            name="teamName"
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-all duration-200"
            placeholder="Введите название команды"
          />
        </div>
        <div>
          <label htmlFor="startKart" className="block text-sm font-medium text-gray-300 mb-1">
            Номер первого карта
          </label>
          <input
            type="number"
            id="startKart"
            name="startKart"
            required
            min="1"
            max="999"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-all duration-200"
            placeholder="Введите номер карта"
          />
        </div>
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