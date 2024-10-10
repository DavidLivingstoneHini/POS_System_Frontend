"use client";

import React, { useEffect, useRef, useState } from "react";
import { Calculator } from "./pos-calculator";
import { ProductTable } from "./products-table";
import { CartTable } from "./cart-table";
import { CustomerInfoTable } from "./customer-info-table";
import { OrderSummaryTable } from "./order-summary-table";
import { Item, OrderData, Payment, Product } from "../../helpers/types";
import { TransactionModal } from "./modals/transaction-modal";
import {
  deleteOrder,
  fetchInventories,
  fetchOrderDetails,
  saveOrder,
} from "../../services/apiService";
import { getCompanyId, getStaffId } from "@/utils/LocalStorageUtils";
import Modal from "./modals/PrintReceipt";
import Receipt from "./receipt";
import FastenerDivider from "@/utils/FastenerDivider";
import ErrorModal from "./modals/error-modal";
import SuccessModal from "./modals/success-modal";
import CustomLoader from "@/utils/CustomLoader";
import Footer from "./footer";

let apiObject: any = {
  products: [],
};

export const POS: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [inputAmount, setInputAmount] = useState<number>(0);
  const [change, setChange] = useState<number>(0);
  const [customerInfo, setCustomerInfo] = useState<{
    customerName: string;
    agentName: string;
    billingAddress: string;
    shippingAddress: string;
    loyaltyBarcode: string;
    telephone: string;
    discountPercentage: number;
    newPrice: number;
    quantity: number;
  }>({
    customerName: "",
    agentName: "",
    billingAddress: "",
    shippingAddress: "",
    loyaltyBarcode: "",
    telephone: "",
    discountPercentage: 0.0,
    newPrice: 0.0,
    quantity: 0,
  });

  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>("");
  const [orderCustomerName, setOrderCustomerName] = useState<string>("");
  const [orderDate, setOrderDate] = useState<string>("");
  const [orderTotalPrice, setOrderTotalPrice] = useState<number>(0);
  const [combinedProducts, setCombinedProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [orderData, setOrderData] = useState<OrderData>({
    affectStock: "no",
    orderId: "000",
    staffid: getStaffId(),
    companyid: getCompanyId(),
    customerName: "",
    customerNumber: "",
    customerTelephone: "",
    subTotal: 0,
    discount: 0,
    tax: 0,
    grandTotal: 0,
    payments: 0,
    customerExtraDiscount: 0,
    customerDiscountRate: 0,
    inprogress: true,
    paymentList: [],
    products: [],
  });
  const [payments, setPayments] = useState<Payment[]>([]);
  const [payment, setPayment] = useState<number>(0);

  const handleOpenModal = (data: any) => {
    setReceiptData(data);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const clearCart = () => {
    setCart([]);
    setOrderDetails([]);
    setSelectedProductIds([]);
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
    setIsErrorModalOpen(true);
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
    setErrorMessage(null);
  };

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    setIsSuccessModalOpen(true);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSuccessMessage(null);
  };

  const handleDeleteOrder = async (orderId: number) => {
    try {
      await deleteOrder(orderId);
      clearCart();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const companyId = getCompanyId();
        if (!companyId) {
          throw new Error("Company ID not found in localStorage");
        }

        const criteria = "All";
        const productData = await fetchInventories(companyId, criteria);
        setProducts(productData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProductData();
  }, []);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const companyId = getCompanyId();
      if (!companyId) {
        throw new Error("Company ID not found in localStorage");
      }
      const criteria = "All";
      const productData = await fetchInventories(companyId, criteria);
      setProducts(productData);
    } catch (error) {
      console.error("Error refreshing products:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };

  // Fetch order details when an order is clicked
  const handleOrderDetailsFetch = async (orderId: string) => {
    try {
      const details = await fetchOrderDetails(orderId);
      console.log("Order Details:", details);

      setOrderId(details.orderId.toString() ?? "n/a");
      setOrderCustomerName(details.customerName ?? "");
      setOrderDate(details.orderDate ?? "");
      setOrderTotalPrice(
        details.posOrderHeadDetails.reduce(
          (acc, item) => acc + (item.total ?? 0),
          0
        )
      );

      setOrderDetails(details.posOrderHeadDetails);

      const newTotal = details.posOrderHeadDetails.reduce(
        (acc, item) => acc + (item.total ?? 0),
        0
      );
      setTotal(newTotal);

      setInputAmount(0);
      setChange(0);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const combineCartAndOrderDetails = () => {
    const combinedProducts: Product[] = [];
    orderDetails.forEach((item) => {
      combinedProducts.push(item);
    });
    cart.forEach((item) => {
      combinedProducts.push(item);
    });
    return combinedProducts;
  };

  useEffect(() => {
    if (orderDetails.length > 0 || cart.length > 0) {
      const products = combineCartAndOrderDetails();
      setCombinedProducts(products);
    }
  }, [orderDetails, cart]);

  const addToCart = (
    product: Product,
    setOrderData: React.Dispatch<React.SetStateAction<OrderData>>,
    prevData: OrderData // Pass the previous orderData to the function
  ) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.productId === product.productId
      );

      // Update orderData.products and apiObject
      setOrderData((prevOrderData) => {
        const existingProducts = prevOrderData.products ?? []; // Use default empty array if undefined

        const existingProductInOrder = existingProducts.find(
          (item) => item.productId === product.productId
        );

        if (existingProductInOrder) {
          // Update existing product in orderData
          const updatedOrderData = {
            ...prevOrderData,
            products: existingProducts.map((item) =>
              item.productId === product.productId
                ? { ...item, quantity: (item.quantity || 0) + 1 }
                : item
            ),
          };
          // Update apiObject
          apiObject.products = updatedOrderData.products;
          return updatedOrderData;
        } else {
          // New product added
          const newProduct = {
            ...product,
            quantity: 1,
          };

          // Ensure apiObject.products is an array before pushing
          if (!Array.isArray(apiObject.products)) {
            apiObject.products = []; // Initialize if not already an array
          }
          apiObject.products.push(newProduct);

          return {
            ...prevOrderData,
            products: [...existingProducts, newProduct], // Use existingProducts
          };
        }
      });

      if (existingProductIndex >= 0) {
        // Update existing product in cart
        const updatedCart = prevCart.map((item, index) =>
          index === existingProductIndex
            ? { ...item, quantity: (item.quantity || 0) + 1 }
            : item
        );
        return updatedCart;
      } else {
        // Add new product to cart
        const newProduct = {
          ...product,
          quantity: 1,
        };
        return [...prevCart, newProduct];
      }
    });
  };

  const removeFromCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.productId === product.productId
      );

      if (existingProductIndex >= 0) {
        const existingProduct = prevCart[existingProductIndex];

        if ((existingProduct.quantity || 0) > 1) {
          const updatedCart = prevCart.map((item, index) =>
            index === existingProductIndex
              ? {
                  ...item,
                  quantity: (item.quantity || 0) - 1,
                  price:
                    (item.sellingPriceActual || 0) -
                    ((item.sellingPriceActual || 0) * (item.discount ?? 0)) /
                      100,
                }
              : item
          );
          setTotal(
            (prevTotal) =>
              prevTotal -
              ((product.sellingPriceActual ?? 0) -
                ((product.sellingPriceActual ?? 0) * (product.discount ?? 0)) /
                  100)
          );
          return updatedCart;
        } else {
          setTotal(
            (prevTotal) =>
              prevTotal -
              ((product.sellingPriceActual ?? 0) -
                ((product.sellingPriceActual ?? 0) * (product.discount ?? 0)) /
                  100)
          );
          return prevCart.filter(
            (item) => item.productId !== product.productId
          );
        }
      }
      return prevCart;
    });
  };

  const calculateGrandTotal = (cart: any[], discountPercentage: number) => {
    return (
      cart.reduce(
        (sum: number, item: { price: number; quantity: number }) =>
          sum + item.price * item.quantity,
        0
      ) *
      (1 - discountPercentage / 100)
    );
  };

  // Refs to hold the latest total payments and grand total
  const totalPaymentsRef = useRef(0);
  const grandTotalRef = useRef(0);

  useEffect(() => {
    // Update refs whenever payments or cart changes
    totalPaymentsRef.current = payments.reduce(
      (sum, payment) => sum + (payment.amount|| 0),
      0
    );
    grandTotalRef.current = calculateGrandTotal(
      cart,
      customerInfo.discountPercentage
    );
  }, [payments, cart, customerInfo]);

  const handleConfirmOrder = () => {
    // Get the latest values from refs
    const totalPayments = totalPaymentsRef.current;
    const grandTotal = grandTotalRef.current;

    // Log the values for debugging
    console.log("Total Payments: ", totalPayments);
    console.log("Grand Total: ", grandTotal);

    // Round the values to avoid floating point precision issues
    const roundedTotalPayments = Math.round(totalPayments * 100) / 100;
    const roundedGrandTotal = Math.round(grandTotal * 100) / 100;

    // Check if total payments are less than grand total
    if (roundedTotalPayments < roundedGrandTotal) {
      alert("Payment not complete.");
      return; // Exit the function if there's a mismatch
    }

    // Proceed with confirming the order
    setCart((prevCart) =>
      prevCart.map((product) => ({
        ...product,
        confirmed: true, // Update the product to be confirmed
      }))
    );

    // Additional logic for confirming the order can go here
    // For example, saving the order to the database or resetting the state
  };

  const handleProductDoubleClick = (product: Product) => {
    addToCart(product, setOrderData, orderData);
  };

  const handleInputAmount = (amount: number) => {
    setInputAmount(amount);
    setChange(amount - total);
  };

  const applyDiscountToCart = (discountPercentage: number, productId: number) => {
    const discountedCart = cart.map((item) => {
      if (item.productId === productId) { // Assuming each item has a unique 'id'
        return {
          ...item,
          price: (item.sellingPriceActual || 0) * (1 - discountPercentage / 100),
          discount: discountPercentage,
        };
      }
      return item; // Return the item unchanged if it doesn't match
    });
  
    setCart(discountedCart);
    setTotal(
      discountedCart.reduce(
        (acc, item) => acc + (item.unitPrice ?? 0) * (item.quantity || 0),
        0
      )
    );
  };  

  const applyPriceToCart = (newPrice: number, productId: number) => {
    const updatedCart = cart.map((item) => {
      if (item.productId === productId) {
        return {
          ...item,
          price: newPrice,
          sellingPriceActual: newPrice,
        };
      }
      return item;
    });
  
    setCart(updatedCart);
    setTotal(
      updatedCart.reduce(
        (acc, item) => acc + (item.unitPrice ?? 0) * (item.quantity || 0),
        0
      )
    );
  };  

  const applyQuantityToCart = (newQuantity: number, productId: number) => {
    const updatedCart = cart.map((item) => {
      if (item.productId === productId) {
        return {
          ...item,
          quantity: newQuantity,
          price:
            (item.sellingPriceActual || 0) *
            (1 - (item.discount || 0) / 100) *
            newQuantity,
        };
      }
      return item;
    });
  
    setCart(updatedCart);
    setTotal(updatedCart.reduce((acc, item) => acc + (item.unitPrice ?? 0), 0));
  };  

  const updateCartItemDiscount = (
    productId: string | number,
    discountPercentage: number
  ) => {
    const updatedCart = cart.map((item) => {
      if (item.sellingPriceActual === productId) {
        return {
          ...item,
          price: item.sellingPriceActual * (1 - discountPercentage / 100),
          discount: discountPercentage,
        };
      }
      return item;
    });
    setCart(updatedCart);
    setTotal(
      updatedCart.reduce((acc, item) => acc + (item.sellingPriceActual || 0), 0)
    );
  };

  const calculateTotal = (cart: Product[]) => {
    const cartTotal = cart.reduce((acc, item) => {
      const discountedPrice =
        (item.sellingPriceActual || 0) * (1 - (item.discount || 0) / 100);
      return acc + discountedPrice * (item.quantity || 0);
    }, 0);
    return orderTotalPrice + cartTotal;
  };

  const grandTotal = calculateTotal(cart);
  console.log("Grand Total: ", grandTotal);
  const discount = total * (customerInfo.discountPercentage / 100);
  const taxes = 0; //TODO: Adjust this based on tax logic
  // const grandTotal = total - discount + taxes;

  const handleCustomerInfoChange = (
    field:
      | "customerName"
      | "agentName"
      | "billingAddress"
      | "shippingAddress"
      | "loyaltyBarcode"
      | "telephone"
      | "discountPercentage"
      | "newPrice"
      | "quantity",
    value: string | number
  ) => {
    setCustomerInfo((prevInfo) => {
      const updatedInfo = { ...prevInfo };
      switch (field) {
        case "customerName":
          updatedInfo.customerName = value as string;
          break;
        case "agentName":
          updatedInfo.agentName = value as string;
          break;
        case "billingAddress":
          updatedInfo.billingAddress = value as string;
          break;
        case "shippingAddress":
          updatedInfo.shippingAddress = value as string;
          break;
        case "loyaltyBarcode":
          updatedInfo.loyaltyBarcode = value as string;
          break;
        case "telephone":
          updatedInfo.telephone = value as string;
          break;
        // case "discountPercentage":
        //   updatedInfo.discountPercentage = value as number;
        //   applyDiscountToCart(value as number);
        //   break;
        // case "newPrice":
        //   updatedInfo.newPrice = value as number;
        //   applyPriceToCart(value as number);
        //   break;
        // case "quantity":
        //   updatedInfo.quantity = value as number;
        //   applyQuantityToCart(value as number);
        //   break;
      }
      return updatedInfo;
    });
  };

  const handleShowTransactionModal = () => {
    setShowTransactionModal(true);
  };

  const handleCloseTransactionModal = () => {
    setShowTransactionModal(false);
  };

  const handleConfirmTransaction = (paymentAmount: number) => {
    setPayments((prevPayments) => [
      ...prevPayments,
      {
        paymentId: 0,
        user: localStorage.getItem("username") ?? "",
        paymentDate: new Date().toISOString(),
        amount: paymentAmount,
        totalBill: grandTotal,
        totalPayment: paymentAmount,
        balance: grandTotal - paymentAmount,
        salesOrderId: localStorage.getItem("selectedOrderId") ?? 0,
      },
    ]);
  };

  const totalPayments = payments.reduce(
    (sum, payment) => sum + (payment.amount || 0),
    0
  );
  console.log("Total Payments: ", totalPayments);

  const balance = total - totalPayments;

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.productId === product.productId
      );

      // Update orderData.products and apiObject
      setOrderData((prevOrderData) => {
        const existingProducts = prevOrderData.products ?? [];

        const existingProductInOrder = existingProducts.find(
          (item) => item.productId === product.productId
        );

        if (existingProductInOrder) {
          // Update existing product in orderData
          const updatedOrderData = {
            ...prevOrderData,
            products: existingProducts.map((item) =>
              item.productId === product.productId
                ? { ...item, quantity: (item.quantity || 0) + 1 }
                : item
            ),
          };
          // Update apiObject
          apiObject.products = updatedOrderData.products;
          return updatedOrderData;
        } else {
          const newProduct = {
            ...product,
            quantity: 1, // Initialize quantity
          };

          // Ensure apiObject.products is an array before pushing
          if (!Array.isArray(apiObject.products)) {
            apiObject.products = []; // Initialize if not already an array
          }
          apiObject.products.push(newProduct);

          return {
            ...prevOrderData,
            products: [...existingProducts, newProduct],
          };
        }
      });

      if (existingProductIndex >= 0) {
        // Update existing product in cart
        const updatedCart = prevCart.map((item, index) =>
          index === existingProductIndex
            ? { ...item, quantity: (item.quantity || 0) + 1 }
            : item
        );
        return updatedCart;
      } else {
        // Add new product to cart
        const newProduct = {
          ...product,
          quantity: 1,
        };
        return [...prevCart, newProduct];
      }
    });
  };

  const updateCartItemQuantity = (
    productId: string | number,
    newQuantity: number
  ) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.productId === productId) {
          return {
            ...item,
            quantity: newQuantity,
            price:
              (item.sellingPriceActual || 0) *
              (1 - (item.discount || 0) / 100) *
              newQuantity,
          };
        }
        return item;
      });
    });

    // Update the total after changing the quantity
    const updatedTotal = cart.reduce((acc, item) => {
      const discountedPrice =
        (item.sellingPriceActual || 0) * (1 - (item.discount || 0) / 100);
      return acc + discountedPrice * (item.quantity || 0);
    }, 0);

    setTotal(updatedTotal);
  };

  const updateCartItemPrice = (
    productId: string | number,
    newPrice: number
  ) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.productId === productId) {
          return {
            ...item,
            sellingPriceActual: newPrice,
            price: newPrice * (item.quantity || 0),
          };
        }
        return item;
      });
    });

    // Update the total after changing the price
    const updatedTotal = cart.reduce((acc, item) => {
      const discountedPrice =
        (item.sellingPriceActual || 0) * (1 - (item.discount || 0) / 100);
      return acc + discountedPrice * (item.quantity || 0);
    }, 0);

    setTotal(updatedTotal);
  };

  useEffect(() => {
    console.log("Selected Product in Parent:", selectedProduct);
  }, [selectedProduct]);

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center">
      {loading ? (
        <CustomLoader />
      ) : (
        <div className="bg-white shadow-lg rounded-lg w-full h-full flex flex-col md:flex-row">
          <div className="md:w-[40%] py-3 px-[11px] bg-gray-50 border-r-3 border-blue-200 pr-4">
            <ProductTable
              selectedProductIds={selectedProductIds}
              setSelectedProductIds={setSelectedProductIds}
              products={products}
              handleProductDoubleClick={handleProductDoubleClick}
              handleRefresh={handleRefresh}
              handleAddToCart={handleAddToCart}
              onOrderSelect={handleOrderDetailsFetch}
              onOpenModal={handleOpenModal}
              handleDeleteOrder={handleDeleteOrder}
              clearCart={clearCart}
              cart={cart}
              setCart={setCart}
              onError={handleError}
              onSuccess={handleSuccess}
              payments={payments}
              handleConfirmTransaction={handleConfirmTransaction}
            />
          </div>
          <FastenerDivider />
          <div className="md:w-[60%] w-[60%] py-3 px-[10px] border-t-4 md:border-t-0 md:border-l-3 border-blue-200">
            <div className="flex flex-row items-center gap-4 bg-slate-100 rounded-md px-4 py-2 mx-[5px]">
              <p className="text-start text-[15px] font-[medium] flex-1 flex-shrink-0 overflow-hidden whitespace-nowrap">
                <b className="text-gray-600 text-[15px]">Order #: </b>
                {orderId}
              </p>
              <div className="w-px h-6 bg-gray-300"></div>
              <p className="flex-1 text-left text-[15px] font-[medium] overflow-hidden whitespace-nowrap">
                <b className="text-gray-600 text-[15px]">Name: </b>
                {orderCustomerName}
              </p>
              <div className="w-px h-6 bg-gray-300"></div>
              <p className="flex-1 text-[15px] font-[medium] overflow-hidden text-ellipsis whitespace-nowrap">
                <b className="text-gray-600 text-[15px]">Date: </b>
                {orderDate}
              </p>
              <div className="w-px h-6 bg-gray-300"></div>
              <p className="flex-1 text-[15px] text-orange-600 font-[medium] text-right">
                <b className="text-gray-600 text-[15px]">Total Price: </b> GH₵
                {""}
                {grandTotal.toFixed(2)}
              </p>
            </div>

            <div>
              <CartTable
                products={combineCartAndOrderDetails()}
                removeFromCart={removeFromCart}
                updateCartItemDiscount={updateCartItemDiscount}
                updateCartItemPrice={(productId, newPrice) => {
                  const updatedCart = cart.map((item) => {
                    if (item.productId === productId) {
                      return {
                        ...item,
                        sellingPriceActual: newPrice,
                        price: newPrice,
                      };
                    }
                    return item;
                  });
                  setCart(updatedCart);
                  setTotal(
                    updatedCart.reduce(
                      (acc, item) => acc + (item.sellingPriceActual || 0),
                      0
                    )
                  );
                }}
                updateCartItemQuantity={updateCartItemQuantity}
                setSelectedProduct={setSelectedProduct}
                selectedProduct={selectedProduct}
              />
            </div>
            <div className="w-full flex flex-row gap-x-7 px-4 py-2 mb-4 border-1 border-dashed rounded-md mt-3 border-gray-400 justify-center items-center">
              <div className="flex flex-col gap-1 mr-[20px]">
                <OrderSummaryTable
                  products={products}
                  grandTotal={grandTotal}
                  discount={
                    grandTotal * (customerInfo.discountPercentage / 100)
                  }
                  taxes={0} //TODO: Add tax calculation logic
                  total={totalPayments} // payments={inputAmount}
                  balance={balance}
                  customerName={customerInfo.customerName}
                />
                <CustomerInfoTable
                  customerInfo={customerInfo}
                  handleCustomerInfoChange={handleCustomerInfoChange}
                  applyDiscount={applyDiscountToCart}
                  applyQuantity={applyQuantityToCart}
                  applyPrice={applyPriceToCart}
                  // productPrice={0} // Pass the actual product price if needed
                  // cartTotal={total} // Pass the current cart total
                  // orderTotal={grandTotal} // Pass the order total
                  // customers={[]} // TODO: Pass actual customer data
                  agents={[]} // TODO: Pass actual agent data
                  addresses={[]} // TODO: Pass actual address data
                  selectedProduct={selectedProduct}
                  setSelectedProduct={setSelectedProduct}
                  onError={handleError}
                  onSuccess={handleSuccess}
                />
              </div>
              <Calculator
                total={calculateTotal(cart)}
                inputAmount={inputAmount}
                change={grandTotal - inputAmount}
                handleInputAmount={handleInputAmount}
                handleConfirmTransaction={handleConfirmTransaction}
                handleEndTransaction={() => {
                  // Handle end transaction logic(IT SHOULD BE END ORDER)
                }}
                handleShowTransactionModal={handleShowTransactionModal}
                onConfirmOrder={handleConfirmOrder}
              />
            </div>
          </div>
        </div>
      )}
      {showTransactionModal && (
        <TransactionModal
          total={totalPayments}
          grandTotal={grandTotal}
          balance={balance}
          inputAmount={inputAmount}
          handleInputAmount={handleInputAmount}
          onClose={handleCloseTransactionModal}
          onConfirmTransaction={handleConfirmTransaction}
        />
      )}
      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={handleCloseModal}>
          <Receipt receiptData={receiptData} />
        </Modal>
      )}
      {isErrorModalOpen && (
        <ErrorModal
          isOpen={isErrorModalOpen}
          message={errorMessage || ""}
          onClose={closeErrorModal}
        />
      )}
      {isSuccessModalOpen && (
        <SuccessModal
          isOpen={isSuccessModalOpen}
          message={successMessage || ""}
          onClose={closeSuccessModal}
        />
      )}
      <Footer />
    </div>
  );
};
