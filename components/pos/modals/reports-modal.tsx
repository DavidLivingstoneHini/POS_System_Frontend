import React from "react";
import { FaTimes } from "react-icons/fa";

interface ReportsModalProps {
  onClose: () => void;
}

export const ReportsModal: React.FC<ReportsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Reports</h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <FaTimes className="text-2xl" />
            </button>
          </div>
          <div className="mb-4">
            <h4 className="text-gray-700 mb-2">Select Report Type:</h4>
            <div className="flex flex-col items-start">
              <button className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg mb-2 w-full">
                Sales Report
              </button>
              <button className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg mb-2 w-full">
                Inventory Report
              </button>
              <button className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg w-full">
                Customer Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};