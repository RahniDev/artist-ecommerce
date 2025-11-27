import type { IProduct, ICategory, IFilterParams, IOrder } from "../types";
import { API } from "../config";
import queryString from "query-string";

/**
 * Helper to wrap fetch + JSON parsing with proper typing.
 */
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
  return fetchJSON<ICategory[]>(`${API}/categories`);
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

export async function read(productId: string): Promise<IProduct> {
  return fetchJSON<IProduct>(`${API}/product/${productId}`);
}

export async function listRelated(productId: string): Promise<IProduct[]> {
  return fetchJSON<IProduct[]>(`${API}/products/related/${productId}`);
}

export interface BraintreeToken {
  clientToken: string;
}

export async function getBraintreeClientToken(
  userId: string,
  token: string
): Promise<BraintreeToken> {
  return fetchJSON<BraintreeToken>(`${API}/braintree/getToken/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export interface PaymentResult {
  success: boolean;
  transaction?: unknown;
  error?: string;
}

export async function processPayment(
  userId: string,
  token: string,
  paymentData: Record<string, unknown>
): Promise<PaymentResult> {
  return fetchJSON<PaymentResult>(`${API}/braintree/payment/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(paymentData),
  });
}

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
