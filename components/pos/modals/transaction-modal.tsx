import { Payment } from "@/helpers/types";
import React, { useState, useEffect } from "react";
import {
  FaCreditCard,
  FaMoneyBillAlt,
  FaWallet,
  FaTimes,
} from "react-icons/fa";

interface TransactionModalProps {
  total: number;
  grandTotal: number;
  balance: number;
  inputAmount: number;
  handleInputAmount: (amount: number) => void;
  onClose: () => void;
  onConfirmTransaction: (paymentAmount: number) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  total,
  grandTotal,
  balance,
  inputAmount,
  handleInputAmount,
  onClose,
  onConfirmTransaction,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "cash" | "card" | "mobile"
  >("cash");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [username, setUsername] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString();
    setCurrentDate(formattedDate);

    const storedUsername = sessionStorage.getItem("username");
    setUsername(storedUsername);

    const storedPayments = sessionStorage.getItem("orderPayments");
    if (storedPayments) {
      setPayments(JSON.parse(storedPayments));
    }
  }, []);

  const handlePaymentMethodChange = (method: "cash" | "card" | "mobile") => {
    setSelectedPaymentMethod(method);
  };

  const handleConfirmTransaction = () => {
    if (inputAmount <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }

    const newPayment: Payment = {
      paymentId: 0,
      user: localStorage.getItem("username") ?? "",
      paymentDate: new Date().toISOString(),
      amount: inputAmount,
      totalBill: grandTotal,
      totalPayment: inputAmount,
      balance: grandTotal - inputAmount,
      salesOrderId: localStorage.getItem("selectedOrderId") ?? 0,
    };

    // Call the onConfirmTransaction prop to update the parent state
    onConfirmTransaction(newPayment.amount ?? 0);

    handleInputAmount(0);
    onClose();
  };

  const totalPayments = payments.reduce(
    (sum, payment) => sum + (payment.amount ?? 0),
    0
  );

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md sm:max-w-lg z-20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Transaction Details</h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <FaTimes className="text-[16px]" />
            </button>
          </div>

          <div className="bg-gray-100 rounded-lg p-2 max-h-32 overflow-y-auto">
            <table className="w-full text-left">
              <tbody>
                {payments.map((payment, index) => (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="py-2 px-4 text-gray-700 border-r border-gray-300">
                      {currentDate}
                    </td>
                    <td className="py-2 px-4 text-gray-700 border-r border-gray-300">
                      {username}
                    </td>
                    <td className="py-2 px-4 text-gray-700">
                      GH₵{(payment.amount ?? 0).toFixed(2)}{" "}
                      {/* Handle undefined */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-4">
            <h4 className="text-gray-700 text-[15px] mt-[16px] mb-2 font-medium">
              Select Payment Method:
            </h4>
            <div className="flex">
              <div className="flex flex-col items-center w-[40%]">
                <button
                  className={`p-2 rounded-lg mb-2 flex items-center justify-start w-full ${
                    selectedPaymentMethod === "cash"
                      ? "bg-orange-500 text-white border border-orange-700"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => handlePaymentMethodChange("cash")}
                >
                  <FaMoneyBillAlt className="text-2xl mr-2" />
                  <span className="text-[14px] font-medium">Cash</span>
                </button>
                <button
                  className={`p-2 rounded-lg mb-2 flex items-center justify-start w-full ${
                    selectedPaymentMethod === "card"
                      ? "bg-orange-500 text-white border border-orange-700"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => handlePaymentMethodChange("card")}
                >
                  <FaCreditCard className="text-2xl mr-2" />
                  <span className="text-[14px] font-medium">Card</span>
                </button>
                <button
                  className={`p-2 rounded-lg flex items-center justify-start w-full ${
                    selectedPaymentMethod === "mobile"
                      ? "bg-orange-500 text-white border border-orange-700"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => handlePaymentMethodChange("mobile")}
                >
                  <FaWallet className="text-2xl mr-2" />
                  <span className="text-[14px] font-medium">Mobile Money</span>
                </button>
              </div>

              <div className="ml-8 flex flex-col w-2/3">
                <div className="bg-gray-100 rounded-lg p-4 mb-2 flex justify-between items-center">
                  <div className="flex flex-col items-start">
                    <h4 className="text-gray-700 mr-4">Total:</h4>
                    <h4 className="text-gray-700 mr-4">Payments:</h4>
                    <h4 className="text-gray-700 mr-4">Balance:</h4>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-gray-700">GH₵{grandTotal.toFixed(2)}</p>
                    <p className="text-orange-600">
                      GH₵{localStorage.getItem("total")}
                    </p>
                    <p className="text-gray-700">
                      GH₵{(grandTotal - totalPayments).toFixed(2)}
                    </p>
                  </div>
                </div>

                <input
                  title="price"
                  type="number"
                  placeholder="Input payment amount..."
                  value={inputAmount}
                  onChange={(e) =>
                    handleInputAmount(parseFloat(e.target.value))
                  }
                  className="p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
                  onClick={handleConfirmTransaction}
                >
                  Confirm Transaction
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
