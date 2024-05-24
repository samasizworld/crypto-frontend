import React from 'react';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Ensure the click is on the backdrop and not on any child elements
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-25 backdrop-blur-sm flex justify-center items-center"
      onClick={handleBackdropClick}
    >
      <div className="w-[600px] flex flex-col bg-white p-2 rounded overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button className="text-black text-xl place-self-end" onClick={onClose}>
          X
        </button>
        <div className="text-black">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
