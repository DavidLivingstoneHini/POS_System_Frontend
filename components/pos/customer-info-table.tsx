import { API_BASE_URL } from "@/config/api-path";
import { Partner, Product } from "@/helpers/types";
import React, { useState, useEffect } from "react";

interface CustomerInfoTableProps {
  customerInfo: {
    customerName: number | string;
    agentName: number | string;
    billingAddress: string;
    shippingAddress: string;
    loyaltyBarcode: string;
    telephone: string;
    discountPercentage: number;
    newPrice: number;
    quantity: number;
  };
  agents: { id: number; name: string }[];
  addresses: { id: number; address: string }[];
  handleCustomerInfoChange: (
    field:
      | "customerName"
      | "agentName"
      | "billingAddress"
      | "shippingAddress"
      | "loyaltyBarcode"
      | "telephone"
      | "discountPercentage",
    value: string | number
  ) => void;
  applyDiscount: (discountPercentage: number) => void;
  applyQuantity: (quantity: number) => void;
  applyPrice: (newPrice: number) => void;
  selectedProduct: Product | null;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

export const CustomerInfoTable: React.FC<CustomerInfoTableProps> = ({
  customerInfo,
  addresses,
  handleCustomerInfoChange,
  applyDiscount,
  applyQuantity,
  applyPrice,
  selectedProduct,
  onError,
  onSuccess,
}) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [agents, setAgents] = useState<Partner[]>([]);
  const [inputValue, setInputValue] = useState<number>(0);
  const [selectedCustomer, setSelectedCustomer] = useState<Partner | null>(
    null
  );
  const [selectedPartnerAddresses, setSelectedPartnerAddresses] = useState<
    { id: number; address1: string }[]
  >([]);

  // Basic Auth
  const BASIC_AUTH_USERNAME = process.env.NEXT_PUBLIC_BASIC_AUTH_USERNAME;
  const BASIC_AUTH_PASSWORD = process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD;

  // Fetch customers from the API
  useEffect(() => {
    const fetchPartners = async () => {
      const headers = new Headers();
      const basicAuth =
        "Basic " + btoa(`${BASIC_AUTH_USERNAME}:${BASIC_AUTH_PASSWORD}`);
      headers.append("Authorization", basicAuth);

      try {
        const response = await fetch(`${API_BASE_URL}/api/partners/customers`, {
          headers,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch partners");
        }

        const data = await response.json();
        console.log("Fetched partners:", data);
        setPartners(data);
      } catch (error) {
        console.error("Error fetching partners:", error);
      }
    };

    fetchPartners();
  }, []);

  useEffect(() => {
    const fetchAgents = async () => {
      const headers = new Headers();
      const basicAuth =
        "Basic " + btoa(`${BASIC_AUTH_USERNAME}:${BASIC_AUTH_PASSWORD}`);
      headers.append("Authorization", basicAuth);

      try {
        const response = await fetch(`${API_BASE_URL}/api/partners/agents`, {
          headers,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch agents");
        }

        const data = await response.json();
        console.log("Fetched agents:", data);
        setAgents(data);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };

    fetchAgents();
  }, []);

  const handleCustomerChange = async (customerId: number) => {
    const customer =
      partners.find((partner) => partner.id === customerId) || null;
    setSelectedCustomer(customer);

    if (customer) {
      handleCustomerInfoChange("telephone", customer.partnerTelephone);
      handleCustomerInfoChange("loyaltyBarcode", customer.barCode);
      handleCustomerInfoChange("discountPercentage", customer.discount);

      // Fetch addresses for the selected partner
      const headers = new Headers();
      const basicAuth =
        "Basic " + btoa(`${BASIC_AUTH_USERNAME}:${BASIC_AUTH_PASSWORD}`);
      headers.append("Authorization", basicAuth);

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/partner-addresses/partner/${customerId}`,
          {
            headers,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch addresses");
        }

        const data = await response.json();
        console.log("Fetched addresses:", data);
        setSelectedPartnerAddresses(data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setSelectedPartnerAddresses([]);
      }
    } else {
      handleCustomerInfoChange("telephone", "");
      handleCustomerInfoChange("loyaltyBarcode", "");
      handleCustomerInfoChange("discountPercentage", 0);
      setSelectedPartnerAddresses([]);
    }
  };

  const handleSaveCustomerInfo = async () => {
    const orderId = localStorage.getItem("selectedOrderId");
    const companyId = localStorage.getItem("companyId");

    // Check for required fields
    if (
      !selectedCustomer ||
      !customerInfo.agentName ||
      !customerInfo.billingAddress ||
      !customerInfo.shippingAddress
    ) {
      console.error("Missing required fields for saving customer info.");
      onError("Missing required fields for saving customer info.");
      return;
    }

    const payload = {
      partner: { id: selectedCustomer.id },
      agent: { id: Number(customerInfo.agentName) },
      billingAddress: { id: Number(customerInfo.billingAddress) },
      shipToAddress: { id: Number(customerInfo.shippingAddress) },
    };

    console.log("Payload to be sent:", JSON.stringify(payload, null, 2));

    const headers = new Headers();
    const basicAuth =
      "Basic " + btoa(`${BASIC_AUTH_USERNAME}:${BASIC_AUTH_PASSWORD}`);
    headers.append("Authorization", basicAuth);
    headers.append("Content-Type", "application/json");

    const url = `${API_BASE_URL}/pos/update_sales_order/${orderId}`;

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to save customer info: ${errorData}`);
      }

      const data = await response.json();
      console.log("Customer info saved successfully:", data);
      onSuccess("Customer info saved successfully!");
    } catch (error) {
      console.error("Error saving customer info:", error);
      const message = "An unknown error occurred.";
      onError(message);
    }
  };

  const handleInputChange = (value: number) => {
    setInputValue(value);
  };

  const handleApplyDiscount = () => {
    if (selectedProduct && inputValue > 0) {
      handleCustomerInfoChange("discountPercentage", inputValue);
      applyDiscount(inputValue);
    }
    setInputValue(0);
  };

  const handleApplyQuantity = () => {
    if (selectedProduct && inputValue > 0) {
      applyQuantity(inputValue);
    }
    setInputValue(0);
  };

  const handleApplyPrice = () => {
    if (selectedProduct && inputValue > 0) {
      applyPrice(inputValue);
    }
    setInputValue(0);
  };

  return (
    <div className="bg-default-50 rounded-lg shadow-md py-2 px-[20px] opacity-90 border border-gray-300">
      <h3 className="text-[15px] font-bold mb-2">Customer Information</h3>
      <div className="flex flex-col gap-[4px]">
        {/* Row for Customer, Agent, and Loyalty Barcode */}
        <div className="flex space-x-2">
          <select
            className="w-1/3 px-1 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={customerInfo.customerName}
            onChange={(e) => {
              const customerId = Number(e.target.value);
              handleCustomerInfoChange("customerName", customerId);
              handleCustomerChange(customerId);
            }}
          >
            <option value="" disabled>
              Select Customer
            </option>
            {partners.length > 0 ? (
              partners.map((partner) => (
                <option key={partner.id} value={partner.id}>
                  {partner.fullName}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No partners available
              </option>
            )}
          </select>

          <select
            className="w-1/3 px-1 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={customerInfo.agentName}
            onChange={(e) =>
              handleCustomerInfoChange("agentName", Number(e.target.value))
            }
          >
            <option value="" disabled>
              Select Agent
            </option>
            {agents.length > 0 ? (
              agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.fullName}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No agents available
              </option>
            )}
          </select>

          <input
            type="text"
            className="w-1/3 px-1 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Loyalty Barcode"
            value={customerInfo.loyaltyBarcode}
            onChange={(e) =>
              handleCustomerInfoChange("loyaltyBarcode", e.target.value)
            }
            disabled={!!selectedCustomer}
          />
        </div>

        {/* Row for Billing Address, Shipping Address, and Telephone */}
        <div className="flex space-x-2">
          <select
            className="w-1/3 px-1 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={customerInfo.billingAddress}
            onChange={(e) => {
              const selectedAddressId = Number(e.target.value);
              handleCustomerInfoChange("billingAddress", selectedAddressId);
            }}
          >
            <option value="" disabled>
              Select Billing Address
            </option>
            {selectedPartnerAddresses.length > 0 ? (
              selectedPartnerAddresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.address1}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No addresses available
              </option>
            )}
          </select>

          <select
            className="w-1/3 px-1 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={customerInfo.shippingAddress}
            onChange={(e) => {
              const selectedAddressId = Number(e.target.value);
              handleCustomerInfoChange("shippingAddress", selectedAddressId);
            }}
          >
            <option value="" disabled>
              Select Shipping Address
            </option>
            {selectedPartnerAddresses.length > 0 ? (
              selectedPartnerAddresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.address1}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No addresses available
              </option>
            )}
          </select>

          <input
            type="tel"
            className="w-1/3 px-1 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Telephone"
            value={customerInfo.telephone}
            onChange={(e) =>
              handleCustomerInfoChange("telephone", e.target.value)
            }
            disabled={!!selectedCustomer}
          />
        </div>

        {/* Row for Action Input and Buttons */}
        <div className="flex space-x-2 items-center">
          <input
            type="number"
            className="w-[32.4%] px-1 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter value"
            value={inputValue}
            onChange={(e) => handleInputChange(parseFloat(e.target.value))}
          />
          <div className="flex flex-row gap-2">
            <button
              className="bg-orange-600 text-center py-[6px] px-[20px] rounded-md text-white text-sm"
              onClick={handleApplyDiscount}
            >
              Disc
            </button>
            <button
              className="bg-blue-600 text-center py-[6px] px-[20px] rounded-md text-white text-sm"
              onClick={handleApplyQuantity}
            >
              Qty
            </button>
            <button
              className="bg-blue-600 text-center py-[6px] px-[20px] rounded-md text-white text-sm"
              onClick={handleApplyPrice}
            >
              Price
            </button>
            <button
              className="bg-green-600 text-center py-[6px] px-[20px] rounded-md text-white text-sm"
              onClick={handleSaveCustomerInfo}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
