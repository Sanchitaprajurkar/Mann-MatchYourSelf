// Order Service for frontend - prevents invalid status values
import axios from "axios";

// API base URL
const API = axios.create({
  baseURL:
    (import.meta.env?.VITE_API_URL as string) || "http://localhost:5000/api",
});

// Valid order status constants (matching backend)
export const ORDER_STATUS = {
  PLACED: "Placed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
} as const;

export type OrderStatusType = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const VALID_ORDER_STATUSES: OrderStatusType[] =
  Object.values(ORDER_STATUS);

// Status mapping for frontend normalization
const STATUS_MAPPING: Record<string, OrderStatusType> = {
  pending: ORDER_STATUS.PLACED,
  processing: ORDER_STATUS.SHIPPED,
  cancelled: ORDER_STATUS.CANCELLED,
  delivered: ORDER_STATUS.DELIVERED,
  shipped: ORDER_STATUS.SHIPPED,
  placed: ORDER_STATUS.PLACED,
};

// Normalize and validate order status
export const normalizeOrderStatus = (status: string): OrderStatusType => {
  if (!status) return ORDER_STATUS.PLACED;

  const normalizedStatus = status.toLowerCase().trim();

  // Return mapped status if available
  if (STATUS_MAPPING[normalizedStatus]) {
    return STATUS_MAPPING[normalizedStatus];
  }

  // Return valid status if it's already correct
  if (VALID_ORDER_STATUSES.includes(status as OrderStatusType)) {
    return status as OrderStatusType;
  }

  // Default to Placed for any invalid input (safe fallback)
  console.warn(
    `⚠️ Invalid order status "${status}" received, defaulting to "Placed"`,
  );
  return ORDER_STATUS.PLACED;
};

// Update order status API call
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const normalizedStatus = normalizeOrderStatus(status);

    const response = await API.put(`/admin/orders/${orderId}`, {
      orderStatus: normalizedStatus,
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ Failed to update order status:", error);
    throw error;
  }
};

// Get order details
export const getOrderById = async (orderId: string) => {
  try {
    const response = await API.get(`/admin/orders/${orderId}`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Failed to fetch order:", error);
    throw error;
  }
};

// Get all orders
export const getAllOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status) {
      const normalizedStatus = normalizeOrderStatus(params.status);
      queryParams.append("status", normalizedStatus);
    }

    const response = await API.get(`/admin/orders?${queryParams.toString()}`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Failed to fetch orders:", error);
    throw error;
  }
};
