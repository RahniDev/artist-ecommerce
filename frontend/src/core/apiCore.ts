import type { IProduct, ApiError, ICategory, IFilterParams, IOrder } from "../types";
import { API } from "../config";
import queryString from "query-string";
import type { BraintreeResponse, BraintreeTransaction, IBraintreePaymentData } from "../types";

// Helper to wrap fetch + JSON parsing with proper typing.
async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function getProducts(sortBy: string): Promise<IProduct[]> {
  return fetchJSON<IProduct[]>(
    `${API}/products?sortBy=${sortBy}&order=desc&limit=6`
  );
}

export async function getCategories(): Promise<ICategory[]> {
  return fetchJSON<ICategory[]>(`${API}/products/categories`);
}

export interface FilterResponse {
  size: number;
  data: IProduct[];
}

export async function getFilteredProducts(
  skip: number,
  limit: number,
  filters: IFilterParams = {}
): Promise<FilterResponse> {
  return fetchJSON<FilterResponse>(`${API}/products/by/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ skip, limit, filters }),
  });
}

export async function list(params: Record<string, unknown>): Promise<IProduct[]> {
  const query = queryString.stringify(params);
  return fetchJSON<IProduct[]>(`${API}/products/search?${query}`);
}

export const read = async (productId: string):
  Promise<IProduct | ApiError> => {
  const res = await fetch(`${API}/product/${productId}`);
  return res.json();
};

export const listRelated = async (productId: string):
  Promise<IProduct[]> => {
  const res = await fetch(`${API}/products/related/${productId}`);
  return res.json();
};

export interface BraintreeToken {
  clientToken: string;
}

export const getBraintreeClientToken = async (
  userId: string,
  token: string
): Promise<BraintreeResponse> => {
  try {
    const response = await fetch(`${API}/braintree/getToken/${userId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } catch (err: any) {
    return { error: err.message || "Error fetching token" };
  }
};

export interface PaymentResult {
  success: boolean;
  transaction?: unknown;
  error?: string;
}

export const processPayment = async (
  userId: string,
  token: string,
  paymentData: IBraintreePaymentData
): Promise<BraintreeTransaction> => {
  const response = await fetch(`${API}/braintree/payment/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(paymentData),
  });
  return response.json();
};


export interface OrderResponse {
  success: boolean;
  order?: unknown;
}

export async function createOrder(
  userId: string,
  token: string,
  createOrderData: IOrder
): Promise<OrderResponse> {
  return fetchJSON<OrderResponse>(`${API}/order/create/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ order: createOrderData }),
  });
}
