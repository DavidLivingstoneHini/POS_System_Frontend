import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  // const handleContextMenu = (e: React.MouseEvent) => {
  //   e.preventDefault(); // Disable right-click context menu
  // };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] shadow-lg relative overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        // onContextMenu={handleContextMenu} // Disable right-click on modal
      >
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-2xl"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
