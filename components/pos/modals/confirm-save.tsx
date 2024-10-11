import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full animate-fade-in">
        <h2 className="text-xl font-semibold mb-4">Confirm Save Order</h2>
        <p className="text-gray-700 mb-6">Are you sure you want to save this order?</p>
        <div className="flex justify-between">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
            onClick={onClose}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
