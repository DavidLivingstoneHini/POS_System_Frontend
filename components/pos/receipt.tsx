"use client";

import React, { useEffect, useState } from "react";
import "../../styles/pos.css";
import QRCodeGenerator from "@/utils/QRCodeGenerator";
import { ReceiptData } from "@/helpers/types";

interface Item {
  orderId: number;
  orderDetailID: string;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  tax: number;
  discount: number;
  total: number;
  stockAffected: boolean;
  edit: boolean;
}

interface ReceiptProps {
  receiptData: ReceiptData | null;
}

const today = new Date();

const Receipt: React.FC<ReceiptProps> = ({ receiptData }) => {
  const items = receiptData ? receiptData.items : [];
  const orderId = localStorage.getItem("selectedOrderId");

  // State to hold the retrieved values
  const [discount, setDiscount] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [taxes, setTaxes] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    // Retrieve values from localStorage
    const storedDiscount = localStorage.getItem("discount");
    const storedGrandTotal = localStorage.getItem("grandTotal");
    const storedTaxes = localStorage.getItem("taxes");
    const storedBalance = localStorage.getItem("balance");
    const storedPayments = localStorage.getItem("total");

    if (storedDiscount) setDiscount(parseFloat(storedDiscount));
    if (storedGrandTotal) setGrandTotal(parseFloat(storedGrandTotal));
    if (storedTaxes) setTaxes(parseFloat(storedTaxes));
    if (storedBalance) setBalance(parseFloat(storedBalance));
    if (storedPayments) setTotal(parseFloat(storedPayments));
  }, []);

  const stringNumberToCurrency = (sNumber: number) => {
    return sNumber.toLocaleString(undefined, {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handlePrint = () => {
    const contentDiv = document.getElementById("print-content");
    if (contentDiv) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(contentDiv.innerHTML);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white">
      <button className="hidden" onClick={handlePrint}>
        Print...
      </button>
      <div
        id="print-content"
        className="w-full max-w-md p-4 bg-white shadow-lg rounded-lg"
      >
        <header className="flex flex-col items-center mb-4">
          <img
            src="/kamaklogo.png"
            alt="Logo"
            className="w-32 h-auto mb-2"
          />
          {/* <h2 className="text-xl font-bold">{receiptData?.loginCompany}</h2> */}
          <br />
          <p className="text-sm">East Legon</p>
          <p className="text-sm">Tel: {receiptData?.companyTelephone}</p>
          <p className="text-sm">Email: kamakgroup@gmail.com</p>
          <button
            className="mt-2 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-500"
            onClick={() => window.print()}
          >
            PRINT RECEIPT
          </button>
        </header>

        <hr className="my-4 border-gray-300" />

        <div className="grid grid-cols-5 text-sm font-semibold mb-2">
          <p>Product</p>
          <p>Px</p>
          <p>Qty</p>
          <p>Disc</p>
          <p>Total</p>
        </div>

        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-5 text-sm mb-1">
            <small>{item.productName}</small>
            <small>{stringNumberToCurrency(item.productPrice ?? 0)}</small>
            <small>{item.quantity ?? 0}</small>
            <small>{stringNumberToCurrency(item.discount ?? 0)}</small>
            <small>{stringNumberToCurrency(item.total ?? 0)}</small>
          </div>
        ))}

        <div className="mt-4 text-center">
          <p className="font-semibold">Thank you for buying from us!</p>
        </div>

        <div className="flex justify-between mt-4 text-sm">
          <small>Order #: {orderId}</small>
          <QRCodeGenerator qrCodeData={orderId ?? ""} />
          <small>{today.toLocaleDateString()}</small>
          <small>{today.toLocaleTimeString()}</small>
        </div>

        <div className="mt-4 border-t pt-2">
          <div className="flex justify-between text-sm">
            <span>Sub Total:</span>
            <span>
              {stringNumberToCurrency(grandTotal - (discount - taxes))}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total Tax:</span>
            <span>{stringNumberToCurrency(taxes)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total Discount:</span>
            <span>{stringNumberToCurrency(discount)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold">
            <span>Grand Total:</span>
            <span>{stringNumberToCurrency(grandTotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total Payment:</span>
            <span>{stringNumberToCurrency(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Balance:</span>
            <span>{stringNumberToCurrency(balance)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
