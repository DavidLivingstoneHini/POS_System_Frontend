import { API_BASE_URL } from "@/config/api-path";
import {
  LoginResponse,
  Product,
  PosOrders,
  OrderDetailsResponse,
  OrderData,
  SaveOrderResponse,
} from "@/helpers/types";

// Basic Auth
const BASIC_AUTH_USERNAME = process.env.NEXT_PUBLIC_BASIC_AUTH_USERNAME;
const BASIC_AUTH_PASSWORD = process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD;

// Login
export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const headers = new Headers();
    const basicAuth =
      "Basic " + btoa(`${BASIC_AUTH_USERNAME}:${BASIC_AUTH_PASSWORD}`);
    headers.append("Authorization", basicAuth);
    headers.append("Content-Type", "application/json");

    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid username or password");
      } else if (response.status === 500) {
        throw new Error("Server error. Please try again later.");
      } else {
        throw new Error(
          "An unexpected error occurred. Please try again later."
        );
      }
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in login function:", error.message);
      throw error;
    } else {
      console.error("Unexpected error in login function:", error);
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
};

// Get Inventory data
export const fetchInventories = async (
  companyId: string,
  criteria: string
): Promise<Product[]> => {
  const headers = new Headers();
  const basicAuth =
    "Basic " + btoa(`${BASIC_AUTH_USERNAME}:${BASIC_AUTH_PASSWORD}`);
  headers.append("Authorization", basicAuth);

  const response = await fetch(
    `${API_BASE_URL}/pos/my_inventories/${companyId}/${criteria}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch inventories");
  }

  const data = await response.json();

  if (data && Array.isArray(data.posInventories)) {
    return data.posInventories;
  } else {
    console.error("Fetched data does not contain posInventories array:", data);
    return [];
  }
};

// Get Orders
export const fetchOrders = async (staffId: string): Promise<PosOrders> => {
  const headers = new Headers();
  const basicAuth =
    "Basic " + btoa(`${BASIC_AUTH_USERNAME}:${BASIC_AUTH_PASSWORD}`);
  headers.append("Authorization", basicAuth);

  const response = await fetch(`${API_BASE_URL}/pos/my_orders/${staffId}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  const data: PosOrders = await response.json();

  if (data && data.posOrders) {
    return data;
  } else {
    console.error("Fetched data does not contain posOrders array:", data);
    return {
      status: 0,
      message: "No orders found",
      salesPerson_userID: Number(staffId),
      grandTotal: 0,
      companyName: "",
      posOrders: [],
    };
  }
};

export const fetchOrderDetails = async (
  orderId: string
): Promise<OrderDetailsResponse> => {
  const headers = new Headers();
  const basicAuth =
    "Basic " + btoa(`${BASIC_AUTH_USERNAME}:${BASIC_AUTH_PASSWORD}`);
  headers.append("Authorization", basicAuth);

  const response = await fetch(`${API_BASE_URL}/pos/order_details/${orderId}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch order details");
  }

  const data: OrderDetailsResponse = await response.json();

  if (data) {
    // Map through the order details and add a confirmed flag
    const updatedOrderDetails: OrderDetailsResponse = {
      ...data,
      posOrderHeadDetails: data.posOrderHeadDetails.map((product) => ({
        ...product,
        confirmed: true,
      })),
    };

    return updatedOrderDetails;
  } else {
    console.error("Fetched data does not contain order details:", data);
    throw new Error("Order details not found");
  }
};

// create new order/save order
export const saveOrder = async (
  orderData: OrderData,
  isUpdate: boolean = false // New parameter to indicate if it's an update
): Promise<SaveOrderResponse> => {
  try {
    console.log("Sending order data:", orderData); // Log the order data being sent

    const method = isUpdate ? "PATCH" : "POST"; // Determine the HTTP method
    const orderId = isUpdate ? orderData.orderId : "000"; // Use "000" for new orders

    const response = await fetch(
      `${API_BASE_URL}/pos/save${isUpdate ? `/${orderId}` : ""}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " + btoa(`${BASIC_AUTH_USERNAME}:${BASIC_AUTH_PASSWORD}`),
        },
        body: JSON.stringify(orderData),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      let errorMessage = "Failed to save order";

      try {
        const errorResponse = JSON.parse(text);
        console.error("Error Response:", errorResponse);
        errorMessage = errorResponse.message || errorMessage;
      } catch (jsonError) {
        errorMessage = text;
      }

      throw new Error(errorMessage);
    }

    const result: SaveOrderResponse = await response.json();
    console.log("Order saved successfully:", result);

    if (!result.orderId || result.orderId === "000") {
      throw new Error("Received invalid order ID from the server");
    }

    return result;
  } catch (error: any) {
    console.error("Error saving order:", error);
    return { orderId: null, error: error.message || "Unknown error" };
  }
};

// Delete order details
export async function deleteOrderDetail(detailid: number): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/pos/delete_order_detail/${detailid}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + btoa(`${BASIC_AUTH_USERNAME}:${BASIC_AUTH_PASSWORD}`),
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete order detail");
  }
}

// Delete an entire order
export async function deleteOrder(orderId: number): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/pos/delete_order/${orderId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " + btoa(`${BASIC_AUTH_USERNAME}:${BASIC_AUTH_PASSWORD}`),
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete order");
    }

    console.log(`Order with ID ${orderId} deleted successfully.`);
  } catch (error: any) {
    console.error("Error deleting order:", error.message);
    throw new Error("Failed to delete order. Please try again later.");
  }
}
