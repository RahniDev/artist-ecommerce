import type {
  IProduct,
  Category,
  IFilterParams,
  IOrder,
  CreateOrderInput,
  IBraintreePaymentData,
  BraintreeTransaction,
  BraintreeTokenResponse,
  FilterResponse,
  ApiResponse
} from "../types";
import { API } from "../config";
import { store } from "../redux/store";

const getCurrentLanguage = (): string => {
  try {
    const state = store.getState();
    return state.language?.currentLanguage || 'en';
  } catch (error) {
    console.warn('Could not get language from Redux, defaulting to en');
    return 'en';
  }
};
// Add language parameter to url
const addLanguageParam = (url: string): string => {
  const lang = getCurrentLanguage();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}lang=${lang}`;
};
async function fetchJSON<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    // Add language parameter to the URL
    const urlWithLang = addLanguageParam(url);

    const res = await fetch(urlWithLang, { ...options, credentials: "include" });
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

export async function getProduct(
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

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  // For non-fetchJSON functions, manually add language
  try {
    const url = addLanguageParam(`${API}/categories`);
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      return { error: `API error: ${res.status} ${res.statusText} - ${text}` };
    }
    const data: Category[] = await res.json();
    return { data };
  } catch (err: any) {
    return { error: err.message || "Network error" };
  }
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

export const list = async (
  params: { search?: string; category?: string }
): Promise<ApiResponse<IProduct[]>> => {
  try {
    const query = new URLSearchParams(params as any).toString();
    const baseUrl = `${API}/products/search?${query}`;
    const url = addLanguageParam(baseUrl);
    const res = await fetch(url);
    const data = await res.json();
    return { data: Array.isArray(data) ? data : [] };
  } catch (err) {
    return { error: "Search failed" };
  }
};

export const createOrder = async ({
  token,
  orderData
}: {
  userId?: string | null;
  token?: string | null;
  orderData: CreateOrderInput;
}): Promise<ApiResponse<IOrder>> => {
  try {
    const url = addLanguageParam(`${API}/order/create`);
    const res = await fetch(
      url,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          order: orderData
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return { error: text };
    }
    return await res.json();
  }
  catch (err: any) {
    return { error: err.message };
  }
};

export async function processPayment(
  paymentData: IBraintreePaymentData,
  token?: string | null
): Promise<ApiResponse<BraintreeTransaction>> {
  const url = addLanguageParam(`${API}/braintree/payment`);
  return fetchJSON<BraintreeTransaction>(
    url,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(paymentData),
    }
  );
}

export async function getBraintreeClientToken(
  token?: string | null
): Promise<BraintreeTokenResponse> {
  try {
    const url = addLanguageParam(`${API}/braintree/getToken`);
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
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