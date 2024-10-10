import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  OrderData,
  OrderDetailsResponse,
  Payment,
  Product,
  ReceiptData,
} from "../../helpers/types";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaListUl,
  FaTable,
  FaSync,
  FaPlus,
  FaFileAlt,
  FaPrint,
  FaSave,
  FaTrash,
} from "react-icons/fa";
import { deleteOrder, fetchOrders, saveOrder } from "@/services/apiService";
import CustomLoader from "@/utils/CustomLoader";
import { useRouter } from "next/navigation";
import { getCompanyId, getStaffId } from "@/utils/LocalStorageUtils";
import Modal from "./modals/PrintReceipt";
import Receipt from "./receipt";
import Image from 'next/image';


interface ProductTableProps {
  products: Product[];
  handleProductDoubleClick: (product: Product) => void;
  handleRefresh: () => void;
  handleAddToCart: (product: Product) => void;
  onOrderSelect: (orderId: string) => void;
  selectedProductIds: string[];
  setSelectedProductIds: React.Dispatch<React.SetStateAction<string[]>>;
  onOpenModal: (data: ReceiptData) => void;
  handleDeleteOrder: (orderId: number) => void;
  clearCart: () => void;
  cart: Product[];
  setCart: React.Dispatch<React.SetStateAction<Product[]>>;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
  payments: Payment[];
  handleConfirmTransaction: (amount: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  handleProductDoubleClick,
  handleRefresh,
  handleAddToCart,
  onOrderSelect,
  selectedProductIds,
  setSelectedProductIds,
  onOpenModal,
  handleDeleteOrder,
  clearCart,
  cart,
  setCart,
  onError,
  onSuccess,
  payments,
  handleConfirmTransaction,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListView, setIsListView] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [orders, setOrders] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [orderProducts, setOrderProducts] = useState<Product[][]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isNewOrderCreated, setIsNewOrderCreated] = useState(false);
  const [orderData, setOrderData] = useState<OrderData>({
    affectStock: "yes",
    orderId: "000",
    staffid: getStaffId(),
    companyid: getCompanyId(),
    customerName: "",
    customerNumber: "",
    customerTelephone: "",
    discount: 0,
    tax: 0,
    customerExtraDiscount: 0,
    customerDiscountRate: 0,
    inprogress: true,
    paymentList: [],
    products: [],
  });

  // State for order summary
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [payment, setPayment] = useState(0);

  //Get orders function
  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const staffId = getStaffId();
        if (!staffId) {
          throw new Error("Staff ID not found in localStorage");
        }
        const data = await fetchOrders(staffId);
        const orderIds = data.posOrders.map((order) =>
          order.orderId.toString()
        );
        setOrders(orderIds);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrdersData();
  }, []);

  const orderTagsRef = useRef<HTMLDivElement>(null);

  const handleSaveOrder = async () => {
    // // Check if there are products in the cart
    // if (selectedOrder && cart.length === 0) {
    //   alert(
    //     "Please add products to the cart before saving the existing order."
    //   );
    //   return;
    // }
    try {
      const newOrderProducts = cart;
      const newPayments = payments;

      // Create a new products array, renaming keys as necessary and calculating totals
      const filteredProducts = newOrderProducts.map(
        (
          {
            defaultImagePath,
            sellingPriceActual,
            applyProductLevelDiscount,
            barCode,
            quantity,
            ...rest
          },
          index
        ) => {
          const productPrice = sellingPriceActual ?? 0;
          const effectiveQuantity = quantity ?? 0;
          const total = productPrice * effectiveQuantity;
          // const discount = applyProductLevelDiscount ? total * 0.1 : 0;
          const discount = total * 0.0;
          // const tax = total * 0.05;
          const tax = total * 0.0;

          return {
            ...rest,
            productPrice,
            quantity: quantity,
            total: total - discount,
            tax,
            orderDetailID: `id${index + 1}`,
            stockAffected: true,
          };
        }
      );

      const filteredPayments = newPayments.map(
        (
          {
            cardPayment,
            ...rest
          },
          index
        ) => {

          return {
            ...rest,
          };
        }
      );

      const orderIdToSave = selectedOrder ? selectedOrder : "000";

      // Create a new order data object excluding specific keys
      const { ...rest } = orderData;

      const updatedOrderData = {
        ...rest,
        orderId: orderIdToSave,
        paymentList: filteredPayments,
        products: filteredProducts,
      };

      console.log("Order Data to be sent:", updatedOrderData);

      const isUpdate = selectedOrder !== null && selectedOrder !== "000";

      if (!isUpdate) {
        setIsNewOrderCreated(true);
      }

      const response = await saveOrder(updatedOrderData, isUpdate);

      const newOrderId = response.orderId ?? "000";

      if (!selectedOrder) {
        setSelectedOrder(newOrderId);
        setOrders((prevOrders) => [...prevOrders, newOrderId]);
      }

      handleProductTagClick(newOrderId); // Trigger click to select the order

      setOrderData((prevData) => ({
        ...prevData,
        orderId: "000",
        products: [],
      }));

      clearCart();

      if (isUpdate) {
        onSuccess("Order saved successfully!");
      }
    } catch (error: any) {
      console.error("Error saving order:", error);
      const message = error.message || "An unknown error occurred.";
      onError(message);
    } finally {
      setIsNewOrderCreated(false);
    }
  };

  // Check if all products in the cart are confirmed
  const allProductsConfirmed = useMemo(() => {
    return cart.every((product) => product.confirmed);
  }, [cart]);

  const onDeleteOrder = async (orderId: number) => {
    try {
      const orderIdString = orderId.toString();

      if (isNewOrderCreated && selectedOrder === orderIdString) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order !== orderIdString)
        );
        setSelectedOrder(null);
        setIsNewOrderCreated(false);
      } else {
        await handleDeleteOrder(orderId);
        const updatedOrders = orders.filter((order) => order !== orderIdString);
        setOrders(updatedOrders);

        // Refresh the entire page after deletion
        window.location.reload();

        if (updatedOrders.length > 0) {
          const nextOrder =
            updatedOrders[
              orders.indexOf(orderIdString) < updatedOrders.length
                ? orders.indexOf(orderIdString)
                : updatedOrders.length - 1
            ];
          setSelectedOrder(nextOrder);
          handleProductTagClick(nextOrder);
        } else {
          setSelectedOrder(null);
        }
      }
      onSuccess("Order deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting order:", error);
      const message = error.message || "An unknown error occurred.";
      onError(message);
    }
  };

  // Scroll to the selected order on change
  useEffect(() => {
    if (selectedOrder && orderTagsRef.current) {
      const selectedButton = orderTagsRef.current.querySelector(
        `[data-order-id="${selectedOrder}"]`
      );
      if (selectedButton) {
        selectedButton.scrollIntoView({ behavior: "smooth", block: "center" });

        // Simulate click if a new order was created
        if (isNewOrderCreated) {
          (selectedButton as HTMLButtonElement).click();
          setIsNewOrderCreated(false);
        }
      } else {
        console.error("Selected button not found:", selectedOrder);
      }
    }
  }, [selectedOrder, isNewOrderCreated]);

  // Scroll to the selected order on change
  useEffect(() => {
    if (selectedOrder && orderTagsRef.current) {
      const selectedButton = orderTagsRef.current.querySelector(
        `[data-order-id="${selectedOrder}"]`
      );
      if (selectedButton) {
        selectedButton.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        console.error("Selected button not found:", selectedOrder);
      }
    }
  }, [selectedOrder]);

  const filteredProducts =
    selectedOrder && orderProducts.length > 0
      ? orderProducts.find((products) =>
          products[0]?.productId?.toString().startsWith(selectedOrder)
        ) || []
      : products.filter((product) => {
          const productName = product.productName?.toLowerCase() || "";
          const barCode = product.barCode?.toLowerCase() || "";
          const sellingPrice = product.sellingPriceActual?.toString() || "";

          return (
            (productName.includes(searchQuery.toLowerCase()) ||
              barCode.includes(searchQuery.toLowerCase()) ||
              sellingPrice.includes(searchQuery)) &&
            (selectedCategory === "" || product.category === selectedCategory)
          );
        });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleProductsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setProductsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleViewChange = () => {
    setIsListView(!isListView);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleProductTagClick = (order: string) => {
    setSelectedOrder(order);
    onOrderSelect(order);
    localStorage.setItem("selectedOrderId", order);
  };

  const router = useRouter();

  const handleOpenModal = () => {
    if (!allProductsConfirmed) {
      // Optionally show a message to the user
      alert("All products must be confirmed to print the receipt.");
      return;
    }

    const preparedReceiptData: ReceiptData = {
      items: products.filter((product) =>
        selectedProductIds.includes(product.productId?.toString() || "")
      ),
      orderId: orderData.orderId,
      companyLogo: "companyLogo", // Replace with actual data
      loginCompany: "Kamak", // Replace with actual data
      companyAddress: "companyAddress", // Replace with actual data
      companyTelephone: "companyTelephone", // Replace with actual data
      companyEmail: "companyEmail", // Replace with actual data
      subTotal: total,
      totalTax: taxes,
      totalDiscount: discount,
      grandTotal: grandTotal,
      totalPayment: payment,
    };

    onOpenModal(preparedReceiptData);
  };

  useEffect(() => {
    const totalAmount = products.reduce(
      (sum, product) => sum + (product.sellingPriceActual ?? 0),
      0
    );

    const discountAmount = totalAmount * 0.1; // 10% discount
    const taxesAmount = totalAmount * 0.15; // 15% tax
    const grandTotalAmount = totalAmount - discountAmount + taxesAmount;
    const paymentsAmount = grandTotalAmount; // Assuming full payment

    setTotal(totalAmount);
    setDiscount(discountAmount);
    setTaxes(taxesAmount);
    setGrandTotal(grandTotalAmount);
    setPayment(paymentsAmount);
  }, [currentProducts, products]);

  const renderPagination = () => {
    const pageNumbers = [];
    const totalPageNumbers = 7;

    if (totalPages <= totalPageNumbers) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const currentPageIndex = currentPage - 1;
      const lastPageIndex = totalPages - 1;

      const startPageIndex = Math.max(
        0,
        Math.min(
          currentPageIndex - Math.floor(totalPageNumbers / 2),
          lastPageIndex - totalPageNumbers + 1
        )
      );
      const endPageIndex = startPageIndex + totalPageNumbers - 1;

      for (let i = startPageIndex; i <= endPageIndex; i++) {
        pageNumbers.push(i + 1);
      }

      if (startPageIndex > 1) {
        pageNumbers.unshift("...");
        pageNumbers.unshift(1);
      }

      if (endPageIndex < lastPageIndex) {
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers.map((page, index) => (
      <button
        key={index}
        className={`px-2 py-1 mx-1 rounded ${
          page === currentPage
            ? "bg-blue-600 text-white"
            : "bg-white hover:bg-blue-400 transition-colors"
        }`}
        onClick={() => {
          if (typeof page === "number") handlePageChange(page);
        }}
      >
        {page}
      </button>
    ));
  };

  return (
    <div className="bg-default-50 rounded-xl shadow-md py-4 px-[10px] opacity-90 relative">
      <div
        className="max-h-[80px] overflow-y-auto mb-4 border-3 border-blue-400 px-4 py-12 rounded-md shadow-lg flex items-center justify-between bg-white"
        ref={orderTagsRef}
      >
        <div className="flex flex-wrap gap-2">
          {orders.map((order, index) => (
            <button
              key={index}
              data-order-id={order}
              className={`px-2 py-[6px] rounded-lg text-white font-semibold transition-all duration-300 ease-in-out ${
                selectedOrder === order
                  ? "bg-gradient-to-r from-orange-500 to-orange-700 shadow-md"
                  : "bg-gradient-to-r from-blue-700 to-blue-400 hover:from-blue-500 hover:to-blue-300 transform hover:scale-105"
              }`}
              onClick={() => handleProductTagClick(order)}
            >
              {order}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end mb-3">
        <div className="ml-3">
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Swimming">Swimming</option>
            {/*TODO: Add more category options if needed */}
          </select>
        </div>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded mr-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative group">
            <button
              className="px-2 py-1 bg-blue-600 hover:bg-blue-400 transition-colors rounded text-white mr-2"
              onClick={handleRefresh}
            >
              <FaSync />
            </button>
            <div className="absolute top-full left-0 bg-gray-800 text-white px-2 py-1 rounded-md text-sm mt-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Refresh
            </div>
          </div>
          <div className="relative group">
            <button
              className="px-2 py-1 bg-blue-600 hover:bg-blue-400 transition-colors rounded text-white"
              onClick={handleViewChange}
            >
              {isListView ? <FaTable /> : <FaListUl />}
            </button>
            <div className="absolute top-full left-0 bg-gray-800 text-white px-2 py-1 rounded-md text-sm mt-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {isListView ? "Switch to table view" : "Switch to list view"}
            </div>
          </div>

          <div className="flex flex-row gap-x-[1px] ml-[10px] border-1 border-blue-500 rounded-md p-[3px]">
            <div className="relative group">
            <div
  className={`${!allProductsConfirmed ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
  onClick={handleOpenModal}
>
                <Image
      src="/printicon.png"
      alt="Save"
      width={34} 
      height={30}
      className="mr-2" 
    />
    </div>
              <div className="absolute top-full left-0 bg-gray-800 text-white px-2 py-1 rounded-md text-sm mt-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Print Order Summary
              </div>
            </div>
            <div className="relative group">
                 <Image
      src="/addicon.png"
      alt="Save"
      width={34} 
      height={30}
      className="cursor-pointer mr-2" 
                       onClick={handleSaveOrder}
    />
              <div className="absolute top-full left-0 bg-gray-800 text-white px-2 py-1 rounded-md text-sm mt-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Create New Order
              </div>
            </div>

            <div className="relative group">
            <div
  className={`${!selectedOrder || selectedOrder === "000" ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
  onClick={() => {
    if (selectedOrder && selectedOrder !== "000") {
      handleSaveOrder();
    }
  }}
>
  <Image
    src="/saveicon.png"
    alt="Save"
    width={34}
    height={30}
    className="mr-2"
  />
</div>

              <div className="absolute top-full left-0 bg-gray-800 text-white px-2 py-1 rounded-md text-sm mt-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Save Order Details
              </div>
            </div>

            {selectedOrder && (
              <div className="relative group">
                   <div
  className={`mr-2 ${!selectedOrder ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
  onClick={() => selectedOrder && onDeleteOrder(parseInt(selectedOrder))}
>
  <Image
    src="/deleteicon.png"
    alt="Delete"
    width={34}
    height={24}
  />
</div>
                <div className="absolute top-full left-0 bg-gray-800 text-white px-2 py-1 rounded-md text-sm mt-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Delete Order
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <select
            id="productsPerPage"
            value={productsPerPage}
            onChange={handleProductsPerPageChange}
            className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div>
      <div
    className="max-h-[400px] overflow-y-auto mb-4 border-3 border-blue-400 rounded-md shadow-lg"
  >
        {isListView ? (
          <ul className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-md">
          {currentProducts.map((product) => (
            <li
              key={product.productId}
              className={`hover:bg-gray-100 transition-colors cursor-pointer py-4 px-6 border-b border-gray-200 flex items-center justify-between ${
                selectedProductIds.includes(product.productId?.toString() || "")
                  ? "bg-blue-50"
                  : ""
              }`}
              onDoubleClick={() => handleProductDoubleClick(product)}
            >
              <div className="flex items-center">
                <img
                  src={product.defaultImagePath}
                  alt={product.productName}
                  className="w-12 h-12 inline-block mr-12 rounded-md shadow-sm"
                />
                <div>
                  <h4 className="font-semibold text-[16px]">{product.productName}</h4>
                  <div className="flex flex-row items-center gap-2">
  <p className="text-gray-600 text-[15px]">{product.barCode}</p>
  <div className="w-[5px] h-[5px] bg-red-600 rounded-full"></div>
  <p className="text-orange-600 text-[15px] font-bold">GH₵{product.sellingPriceActual}</p>
</div>
                </div>
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
              >
                <FaPlus />
              </button>
            </li>
          ))}
        </ul>        
        ) : (
          <table className="w-full bg-default-50 h-[350px] shadow-md rounded-lg overflow-hidden border border-gray-300">
            <thead>
            <tr className="bg-gradient-to-r from-blue-400 to-blue-600 border-b border-gray-200">
            <th
                  className="py-2 text-center border-r text-[14px] text-white border-gray-300 border-l"
                  style={{ width: "60px" }}
                >
                  Image
                </th>
                <th
                  className="py-2 text-center text-[14px] text-white border-r border-gray-300"
                  style={{ width: "300px" }}
                >
                  Product
                </th>
                <th
                  className="py-2 px-2 text-center text-[14px] text-white border-r border-gray-300"
                  style={{ width: "100px" }}
                >
                  Category
                </th>
                <th
                  className="py-2 text-center text-[14px] text-white border-r border-gray-300"
                  style={{ width: "100px" }}
                >
                  Barcode
                </th>
                <th
                  className="py-2 text-center text-[14px] text-white border-r border-gray-300"
                  style={{ width: "100px" }}
                >
                  Price (GH₵)
                </th>
                <th
                  className="py-2 text-left border-r border-gray-300"
                  style={{ width: "60px" }}
                ></th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr
                  key={product.productId}
                  className="hover:bg-blue-100 transition-colors cursor-pointer border-b border-gray-200"
                  onDoubleClick={() => handleProductDoubleClick(product)}
                >
                  <td
                    className="py-2 px-4 border-r border-l border-gray-200"
                    style={{ width: "60px" }}
                  >
                    <img
                      src={product.defaultImagePath}
                      alt={product.productName}
                      className="w-8 h-8 inline-block"
                    />
                  </td>
                  <td
                    className="py-2 px-4 border-r border-gray-200 text-[15px] font-[500]"
                    style={{ width: "300px" }}
                  >
                    {product.productName}
                  </td>
                  <td
                    className="py-2 px-4 border-r border-gray-200 text-[14px] font-[500]"
                    style={{ width: "100px" }}
                  >
                    {product.category}
                  </td>
                  <td
                    className="py-2 px-4 border-r border-gray-200 text-[14px] font-[500]"
                    style={{ width: "100px" }}
                  >
                    {product.barCode}
                  </td>
                  <td
                    className="py-2 px-4 border-r border-gray-200 text-[14px] text-orange-600 font-[500]"
                    style={{ width: "100px" }}
                  >
                    {(product.sellingPriceActual ?? 0).toFixed(2)}
                  </td>
                  <td
                    className="py-2 px-4 border-r border-gray-200 font-[500]"
                    style={{ width: "50px" }}
                  >
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <FaPlus />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-300">
                <td colSpan={6} className="py-2 px-4"></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
      </div>
      <div className="flex items-center justify-center mt-4">
        <button
          className={`px-2 py-1 mx-1 rounded ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-300 transition-colors"
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft color="#3182ce" />
        </button>
        {renderPagination()}
        <button
          className={`px-2 py-1 mx-1 rounded ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-300 transition-colors"
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FaChevronRight color="#3182ce" />
        </button>
      </div>
      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <Receipt receiptData={receiptData} />
        </Modal>
      )}
    </div>
  );
};
