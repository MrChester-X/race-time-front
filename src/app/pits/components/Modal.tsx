import { useEffect, useState, ReactNode } from "react";
import CloseIcon from "./icons/CloseIcon";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Используем requestAnimationFrame для более плавной анимации
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      // Ждем окончания анимации перед удалением из DOM
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black flex items-center justify-center z-50 transition-opacity duration-300 ease-out ${
        isAnimating ? 'bg-opacity-75' : 'bg-opacity-0'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-700 transition-all duration-300 ease-out ${
          isAnimating 
            ? 'transform scale-100 opacity-100' 
            : 'transform scale-90 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-300 p-1 transition-colors duration-150"
          >
            <CloseIcon />
          </button>
        </div>
        
        {children}
      </div>
    </div>
  );
}