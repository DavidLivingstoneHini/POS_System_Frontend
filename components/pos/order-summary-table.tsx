import React, { forwardRef, useEffect } from "react";
import { Product } from "../../helpers/types";

interface OrderSummaryTableProps {
  products: Product[];
  grandTotal: number;
  total: number;
  discount: number;
  taxes: number;
  balance: number;
  customerName: string;
}

const saveOrderSummaryToLocalStorage = (
  grandTotal: number,
  discount: number,
  taxes: number,
  balance: number,
  total: number
) => {
  localStorage.setItem("grandTotal", grandTotal.toString());
  localStorage.setItem("discount", discount.toString());
  localStorage.setItem("taxes", taxes.toString());
  localStorage.setItem("balance", balance.toString());
  localStorage.setItem("total", total.toString());
};

const OrderSummaryTable = forwardRef<HTMLDivElement, OrderSummaryTableProps>(
  ({ products, grandTotal, total, discount, taxes, customerName }, ref) => {
    const balance = grandTotal - total;

    useEffect(() => {
      saveOrderSummaryToLocalStorage(
        grandTotal,
        discount,
        taxes,
        balance,
        total
      );
    }, [grandTotal, discount, taxes, balance, total]);

    return (
      <div
        ref={ref}
        className="bg-default-100 rounded-lg shadow-md py-2 px-[38px] opacity-90 max-w-xl mx-auto border border-gray-300"
      >
        <div className="flex flex-row gap-4 items-center mb-[5px] border-t border-gray-300 pt-[5px]">
          <h3 className="text-[15px] font-bold mb-[5px]">Order Summary</h3>
          <div className="bg-gray-300 w-[4px] h-[4px] rounded-full"></div>
          <div className="flex flex-row gap-x-1 items-center">
            <h4 className="text-red-500 text-[12px]">Status: </h4>
            <p className="text-red-500 text-[12px]">New</p>
          </div>
          <div className="bg-gray-300 w-[4px] h-[4px] rounded-full"></div>
          <input
            id="customer-name"
            type="text"
            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-[240px] h-[30px] placeholder-gray-400 text-[13px] text-ellipsis overflow-hidden"
            value={customerName}
            placeholder="Customer Name or Table #"
            readOnly
          />
        </div>
        <div className="grid grid-cols-3 gap-y-[6px] gap-x-[12px] border-t border-gray-300 pt-[6px]">
          <div className="flex gap-[6px] items-center">
            <h4 className="font-medium text-[14px]">G.Total:</h4>
            <p className="font-bold text-gray-600 text-[14px]">
              GH₵{grandTotal.toFixed(2)}
            </p>
          </div>
          <div className="flex gap-[6px] items-center">
            <h4 className="font-medium text-[14px]">Discount:</h4>
            <p className="font-medium text-gray-600 text-[14px]">
              GH₵{discount.toFixed(2)}
            </p>
          </div>
          <div className="flex gap-[6px] items-center">
            <h4 className="font-medium text-[14px]">Taxes:</h4>
            <p className="font-medium text-gray-600 text-[14px]">
              GH₵{taxes.toFixed(2)}
            </p>
          </div>
          <div className="flex gap-[6px] items-center">
            <h4 className="font-medium text-[14px]">Payments:</h4>
            <p className="font-[600] text-orange-600 text-[14.5px]">
              GH₵{total.toFixed(2)}
            </p>
          </div>
          <div className="flex gap-[6px] items-center">
            <h4 className="font-medium text-[14px]">Balance:</h4>
            <p className="font-bold text-gray-600 text-[14px]">
              GH₵{balance.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

OrderSummaryTable.displayName = "OrderSummaryTable";

export { OrderSummaryTable };
