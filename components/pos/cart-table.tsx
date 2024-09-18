import React, { useState } from "react";
import { Product } from "../../helpers/types";
import { DeleteIcon } from "../icons/accounts/delete-icon";
import { deleteOrderDetail } from "@/services/apiService";

interface CartTableProps {
  products: Product[];
  removeFromCart: (product: Product) => void;
  setSelectedProduct: (product: Product | null) => void;
  selectedProduct: Product | null;
  updateCartItemDiscount: (
    productId: string | number,
    discountPercentage: number
  ) => void;
  updateCartItemPrice: (productId: string | number, newPrice: number) => void;
  updateCartItemQuantity: (
    productId: string | number,
    quantity: number
  ) => void;
}

export const CartTable: React.FC<CartTableProps> = ({
  products,
  removeFromCart,
  setSelectedProduct,
  selectedProduct,
  updateCartItemDiscount,
  updateCartItemPrice,
  updateCartItemQuantity,
}) => {
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editableValues, setEditableValues] = useState<{
    quantity: number;
    price: number;
    discount: number;
  } | null>(null);

  const handleDeleteClick = async (product: Product) => {
    try {
      await deleteOrderDetail(product.productId || 0);
      removeFromCart(product);
    } catch (error) {
      console.error("Error deleting order detail:", error);
    }
  };

  const handleRowClick = (product: Product) => {
    if (selectedProduct?.productId === product.productId) {
      setSelectedProduct(null);
    } else {
      setSelectedProduct(product);
    }
  };

  const handleDoubleClick = (
    product: Product,
    field: "quantity" | "price" | "discount"
  ) => {
    if (product.productId !== undefined) {
      setEditingProductId(product.productId);
      setEditableValues({
        quantity: product.quantity || 0,
        price: product.sellingPriceActual || product.unitPrice || 0,
        discount: product.discount || 0,
      });
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    product: Product
  ) => {
    if (e.key === "Enter" && editableValues) {
      if (product.productId !== undefined) {
        updateCartItemQuantity(product.productId, editableValues.quantity);
        updateCartItemPrice(product.productId, editableValues.price);
        updateCartItemDiscount(product.productId, editableValues.discount);

        // Reset editing state
        setEditingProductId(null);
        setEditableValues(null); // Clear editable values after update
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 rounded-xl shadow-lg p-4 opacity-90">
      <div className="max-h-[280px] h-[280px] overflow-y-auto">
        <table className="w-full bg-white shadow-md border border-gray-300 rounded-lg">
          <thead className="sticky top-0 bg-blue-400 text-white">
            <tr className="border-b border-gray-300">
              <th className="py-2 px-4 text-left border-r border-gray-300">
                Name
              </th>
              <th className="py-2 px-4 text-left border-r border-gray-300">
                Qty
              </th>
              <th className="py-2 px-4 text-left border-r border-gray-300">
                Price(GH₵)
              </th>
              <th className="py-2 px-4 text-left border-r border-gray-300">
                Disc
              </th>
              <th className="py-2 px-4 text-left border-r border-gray-300">
                Tax
              </th>
              <th className="py-2 px-4 text-left border-r border-gray-300">
                Total(GH₵)
              </th>
              <th className="py-2 px-4 text-left border-r border-gray-300">
                Confirmed
              </th>
              <th className="py-2 px-4 text-left border-r border-gray-300"></th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product, index) => (
                <tr
                  key={`${product.productId}-${index}`}
                  className={`cursor-pointer transition-colors border-b border-gray-200 ${
                    selectedProduct?.productId === product.productId
                      ? "bg-orange-100"
                      : "hover:bg-blue-100"
                  }`}
                  onClick={() => handleRowClick(product)}
                >
                  <td className="py-2 px-4 border-r border-gray-300 text-sm font-medium">
                    {product.productName}
                  </td>
                  <td
                    className="py-2 px-4 border-r border-gray-300 text-sm font-medium"
                    onDoubleClick={() => handleDoubleClick(product, "quantity")}
                  >
                    {editingProductId === product.productId ? (
                      <input
                        type="number"
                        value={editableValues?.quantity || product.quantity}
                        onChange={(e) =>
                          setEditableValues({
                            ...editableValues!,
                            quantity: parseFloat(e.target.value),
                          })
                        }
                        onKeyPress={(e) => handleKeyPress(e, product)}
                        className="border border-gray-300 rounded px-1"
                      />
                    ) : (
                      product.quantity
                    )}
                  </td>
                  <td
                    className="py-2 px-4 border-r border-gray-300 text-sm text-orange-600 font-medium"
                    onDoubleClick={() => handleDoubleClick(product, "price")}
                  >
                    {editingProductId === product.productId ? (
                      <input
                        type="number"
                        value={
                          editableValues?.price ||
                          product.sellingPriceActual ||
                          product.unitPrice ||
                          0
                        }
                        onChange={(e) =>
                          setEditableValues({
                            ...editableValues!,
                            price: parseFloat(e.target.value),
                          })
                        }
                        onKeyPress={(e) => handleKeyPress(e, product)}
                        className="border border-gray-300 rounded px-1"
                      />
                    ) : (
                      (
                        product.sellingPriceActual ||
                        product.unitPrice ||
                        0
                      ).toFixed(2)
                    )}
                  </td>
                  <td
                    className="py-2 px-4 border-r border-gray-300 text-sm font-medium"
                    onDoubleClick={() => handleDoubleClick(product, "discount")}
                  >
                    {editingProductId === product.productId ? (
                      <input
                        type="number"
                        value={editableValues?.discount || product.discount}
                        onChange={(e) =>
                          setEditableValues({
                            ...editableValues!,
                            discount: parseFloat(e.target.value),
                          })
                        }
                        onKeyPress={(e) => handleKeyPress(e, product)}
                        className="border border-gray-300 rounded px-1"
                      />
                    ) : (
                      product.discount
                    )}
                  </td>
                  <td className="py-2 px-4 border-r border-gray-300 text-sm font-medium">
                    0%
                  </td>
                  <td>
                    {(
                      ((product.sellingPriceActual || 0) -
                        ((product.sellingPriceActual || 0) *
                          (product.discount || 0)) /
                          100) *
                        (product.quantity || 0) ||
                      product.total ||
                      0
                    ).toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-r border-gray-300 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={product.confirmed || false}
                      className="form-checkbox h-5 w-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      readOnly
                    />
                  </td>
                  <td className="py-2 px-4 border-r border-gray-300">
                    <button
                      className={`${
                        product.confirmed
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      } text-white font-bold py-1 px-2 rounded`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!product.confirmed) {
                          handleDeleteClick(product);
                        }
                      }}
                      disabled={product.confirmed}
                    >
                      <DeleteIcon color="white" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-b border-gray-300">
                <td colSpan={8} className="py-2 px-4 text-center text-gray-500">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
