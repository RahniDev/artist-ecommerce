import type {
  IProduct,
  ICategory,
  IFilterParams,
  IOrder,
  IBraintreePaymentData,
  BraintreeTransaction,
} from "../types";
import { API } from "../config";
import queryString from "query-string";
import type { ApiResponse } from "../types";

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, { ...options, credentials: "include" });
    if (!res.ok) {
      const text = await res.text();
      return { error: `API error: ${res.status} ${res.statusText} - ${text}` };
    }
    const data = await res.json();
    return { data };
  } catch (err: any) {
    return { error: err.message || "Network error" };
  }
}

export async function getProducts(
  sortBy: string
): Promise<ApiResponse<{ data: IProduct[] }>> {
  return fetchJSON<{ data: IProduct[] }>(
    `${API}/products?sortBy=${sortBy}&order=desc&limit=6`
  );
}

export async function read(
  productId: string
): Promise<ApiResponse<IProduct>> {
  return fetchJSON<IProduct>(`${API}/product/${productId}`);
}

export async function listRelated(
  productId: string
): Promise<ApiResponse<{ data: IProduct[] }>> {
  return fetchJSON<{ data: IProduct[] }>(
    `${API}/products/related/${productId}`
  );
}

export async function getCategories(): Promise<ApiResponse<ICategory[]>> {
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
): Promise<ApiResponse<FilterResponse>> {
  return fetchJSON<FilterResponse>(`${API}/products/by/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skip, limit, filters }),
  });
}

export async function list(
  params: Record<string, unknown>
): Promise<ApiResponse<IProduct[]>> {
  const query = queryString.stringify(params);
  return fetchJSON<IProduct[]>(`${API}/products/search?${query}`);
}

export async function createOrder(
  userId: string,
  token: string,
  createOrderData: IOrder
): Promise<ApiResponse<{ success: boolean; order?: unknown }>> {
  return fetchJSON<{ success: boolean; order?: unknown }>(
    `${API}/order/create/${userId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ order: createOrderData }),
    }
  );
}

export async function processPayment(
  userId: string,
  token: string,
  paymentData: IBraintreePaymentData
): Promise<ApiResponse<BraintreeTransaction>> {
  return fetchJSON<BraintreeTransaction>(
    `${API}/braintree/payment/${userId}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    }
  );
}

export interface BraintreeTokenResponse {
  clientToken?: string;
  error?: string;
}

export async function getBraintreeClientToken(
  userId: string,
  token: string
): Promise<BraintreeTokenResponse> {
  try {
    const res = await fetch(`${API}/braintree/getToken/${userId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return {
        error: `API error: ${res.status} ${res.statusText} - ${text}`,
      };
    }

    const data = await res.json();
    return { clientToken: data.clientToken };
  } catch (err: any) {
    return { error: err.message || "Failed to get Braintree token" };
  }
}