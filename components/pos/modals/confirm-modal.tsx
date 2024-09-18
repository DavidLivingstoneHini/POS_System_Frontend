import React from "react";

interface ConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  amount: number;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  onConfirm,
  onCancel,
  amount,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-bold mb-2">Confirm order</h3>
        <p className="mb-4">Are you sure you want to confirm this order?</p>
        <div className="flex justify-between">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded-lg"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-lg"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
