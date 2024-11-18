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
  const [items, setItems] = useState<Item[]>([]);
  const orderId = localStorage.getItem("selectedOrderId");

  const [discount, setDiscount] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [taxes, setTaxes] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
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

    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      const parsedItems = JSON.parse(storedCartItems) as Item[];
      setItems(parsedItems);
    }
  }, []);

  const stringNumberToCurrency = (sNumber: number | undefined | null) => {
    if (typeof sNumber !== "number" || isNaN(sNumber)) {
      return "0.00";
    }
    
    return sNumber.toLocaleString(undefined, {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };  

  const handlePrint = () => {
    const contentDiv = document.getElementById("print-content");
    if (contentDiv) {
      console.log(contentDiv.innerHTML); // Check what is being printed
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Receipt</title>
             <style>
  body {
    font-family: 'Courier New', Courier, monospace;
    width: 300px; /* Adjust width for your receipt */
    margin: 0 auto; /* Center the receipt */
    padding: 10px; /* Add padding */
  }
  
  img {
    width: 120px;
    height: auto;
    display: block;
    margin: 0 auto;
  }

  .header, .footer {
    text-align: center;
    margin-bottom: 10px;
  }

  .container {
    display: grid;
    justify-content: space-between;
    grid-template-columns: repeat(5, 1fr);
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    border-bottom: 1px dashed #d1d5db;
    padding-bottom: 0.5rem;
}

.product {
  margin-right: 12px;
}

  .item {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 5px;
    border-bottom: 1px dashed #ccc;
    padding: 5px 0;
}

.item small {
    margin-right: 10px;
}

/* Specific spacing classes */
.product-name {
    flex: 2; 
    text-align: left;
}

.product-price {
    flex: 1;
    text-align: right;
}

.product-quantity {
    flex: 1;
    text-align: right;
}

.product-discount {
    flex: 1;
    text-align: right;
}

.product-total {
    flex: 1;
    text-align: right;
}

.total {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    font-weight: bold; 
    border-top: 1px dashed #D1D5DB; 
    padding-top: 0.5rem; 
}

 .custom-size {
    height: 128px !important;
    width: 128px !important;
    display: block !important;
}

.order-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.when {
  margin-right: 8px;
}

  @media print {
    button {
      display: none;
    }
    img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
    display: block !important;
    vertical-align: middle !important;
}
    custom-size {
    height: 128px !important;
    width: 128px !important;
    display: block !important;
}
    QRCodeGenerator {
    display: block !important;
    }

  }
</style>
            </head>
            <body>
              ${contentDiv.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        // printWindow.close();
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white">
      <div
        id="print-content"
        className="w-full max-w-md p-4 bg-white shadow-lg rounded-lg"
        style={{
          fontFamily: "'Courier New', Courier, monospace", // Mimic printed receipts
        }}
      >
        <header className="header">
          <img
            src="/kamaklogo.png"
            alt="Logo"
            className="w-[120px] h-auto mb-2"
          />
          <p className="text-sm">East Legon</p>
          <p className="text-sm">Tel: {receiptData?.companyTelephone}</p>
          <p className="text-sm">Email: service@kamakagroup.com</p>
          <button
            className="mt-2 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-500"
            onClick={handlePrint}
          >
            PRINT RECEIPT
          </button>
        </header>

        <hr className="my-4 border-gray-300" />

        <div className="text-sm font-bold mb-2">
          <p>Order Summary</p>
        </div>

        <div className="container grid grid-cols-5 text-sm font-semibold mb-2 border-b border-dashed border-gray-300 pb-2">
        <p>Qty</p>
          <p className="product">Product</p>
          <p>Price</p>
          <p>Disc</p>
          <p>Total</p>
        </div>

        {items.map((item, index) => (
          <div
            key={index}
            className="item grid grid-cols-5 text-sm mb-1 border-b border-dashed border-gray-200 pb-1"
          >
            <small>{item.quantity}</small>
            <small>{item.productName}</small>
            <small>{stringNumberToCurrency(item.productPrice)}</small>
            <small>{item.discount}</small>
            <small>{stringNumberToCurrency(item.total)}</small>
          </div>
        ))}

        <div className="mt-4 text-center text-sm font-bold">
          <p>Thank you for your purchase!</p>
        </div>

        <div className="order-section flex justify-between mt-4 text-sm border-t border-gray-300 pt-2">
          <small>Order #: {orderId}</small>
          <div className="time-section flex flex-col">
            <small className="when">{today.toLocaleDateString()}</small>
            <small>{today.toLocaleTimeString()}</small>
          </div>
        </div>

        <div className="mt-4 border-t border-gray-300 pt-2">
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
          <div className="total flex justify-between text-sm font-bold border-t border-dashed border-gray-300 pt-2">
            <span>Grand Total:</span>
            <span>{stringNumberToCurrency(grandTotal)}</span>
          </div>
          <div className="total flex justify-between text-sm">
            <span>Total Payment:</span>
            <span>{stringNumberToCurrency(total)}</span>
          </div>
          <div className="total flex justify-between text-sm">
            <span>Balance:</span>
            <span>{stringNumberToCurrency(balance)}</span>
          </div>
          <QRCodeGenerator className="custom-size" qrCodeData={orderId || ""} />
        </div>
      </div>
    </div>
  );
};

export default Receipt;
