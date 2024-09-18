import React, { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { MoneyIcon } from "../icons/accounts/money-icon";
import ConfirmationModal from "./modals/confirm-modal";

interface CalculatorProps {
  total: number;
  inputAmount: number;
  change: number;
  handleInputAmount: (amount: number) => void;
  handleConfirmTransaction: (paymentAmount: number) => void;
  handleEndTransaction: () => void;
  handleShowTransactionModal: () => void;
  onConfirmOrder: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  total,
  inputAmount,
  change,
  handleInputAmount,
  handleConfirmTransaction,
  handleEndTransaction,
  handleShowTransactionModal,
  onConfirmOrder,
}) => {
  const [hasDecimal, setHasDecimal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleKeypadClick = (value: string) => {
    if (value === "C") {
      handleInputAmount(0);
      setHasDecimal(false);
    } else if (value === ".") {
      if (!hasDecimal) {
        handleInputAmount(parseFloat(`${inputAmount}.`));
        setHasDecimal(true);
      }
    } else {
      handleInputAmount(parseFloat(`${inputAmount}${value}`));
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const confirmTransaction = () => {
    handleConfirmTransaction(inputAmount);
    onConfirmOrder();
    closeModal();
  };

  return (
    <div className="bg-gray-800 px-3 py-2 rounded-lg shadow-lg max-w-[30%] mt-[-5px]">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-white">Total</h3>
        <p className="text-sm font-bold text-white">GH₵{total.toFixed(2)}</p>
      </div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-white">Input Amount</h3>
        <input
          title="price"
          type="number"
          className="bg-gray-700 rounded-lg px-2 py-1 w-20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-white"
          value={inputAmount}
          onChange={(e) => handleInputAmount(parseFloat(e.target.value))}
        />
      </div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-white">Balance</h3>
        <p className="text-sm font-bold text-white">GH₵{change.toFixed(2)}</p>
      </div>
      <div className="grid grid-cols-3 gap-1 mb-3">
        {["7", "8", "9", "4", "5", "6", "1", "2", "3", "C", "0", "."].map(
          (value) => (
            <button
              key={value}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-[6px] px-[2px] rounded-lg text-xs"
              onClick={() => handleKeypadClick(value)}
            >
              {value}
            </button>
          )
        )}
      </div>
      <div className="flex justify-between">
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded-lg flex-1 mr-1 text-xs"
          onClick={openModal}
        >
          Confirm
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-lg flex-1 mr-1 text-xs"
          onClick={handleEndTransaction}
        >
          End
        </button>
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded-lg flex-1 text-xs"
          onClick={() => handleInputAmount(0)}
        >
          <FaTrashAlt color="orange" />
        </button>
        <button
          className="flex flex-row gap-x-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded-lg flex-1 ml-1 text-xs"
          onClick={handleShowTransactionModal}
        >
          <MoneyIcon /> <p className="text-xs">Pay</p>
        </button>
      </div>

      {showModal && (
        <ConfirmationModal
          onConfirm={confirmTransaction}
          onCancel={closeModal}
          amount={inputAmount}
        />
      )}
    </div>
  );
};
