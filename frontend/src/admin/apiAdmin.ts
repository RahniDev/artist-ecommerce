// apiAdmin.ts
import { API } from '../config';

export interface Category {
  name: string;
}

export interface Product {
  [key: string]: any; // adjust this interface based on your Product fields
}

export interface ApiResponse<T = any> {
  error?: string;
  data?: T;
}

export const createCategory = async (
  userId: string,
  token: string,
  category: Category
): Promise<ApiResponse> => {
  try {
    const res = await fetch(`${API}/category/create/${userId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateCategory = async (
  categoryId: string,
  userId: string,
  token: string,
  category: Category
): Promise<ApiResponse> => {
  try {
    const res = await fetch(`${API}/category/${categoryId}/${userId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const createProduct = async (
  userId: string,
  token: string,
  product: FormData
): Promise<ApiResponse> => {
  try {
    const res = await fetch(`${API}/product/create/${userId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: product,
    });
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getCategory = async (categoryId: string): Promise<ApiResponse> => {
  try {
    const res = await fetch(`${API}/category/${categoryId}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getCategories = async (): Promise<ApiResponse[]> => {
  try {
    const res = await fetch(`${API}/categories`);
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const listOrders = async (userId: string, token: string): Promise<ApiResponse[]> => {
  try {
    const res = await fetch(`${API}/order/list/${userId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getStatusValues = async (userId: string, token: string): Promise<string[]> => {
  try {
    const res = await fetch(`${API}/order/status-values/${userId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateOrderStatus = async (
  userId: string,
  token: string,
  orderId: string,
  status: string
): Promise<ApiResponse> => {
  try {
    const res = await fetch(`${API}/order/${orderId}/status/${userId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, orderId }),
    });
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getProducts = async (): Promise<ApiResponse[]> => {
  try {
    const res = await fetch(`${API}/products?limit=undefined`);
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteProduct = async (
  productId: string,
  userId: string,
  token: string
): Promise<ApiResponse> => {
  try {
    const res = await fetch(`${API}/product/${productId}/${userId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getProduct = async (productId: string): Promise<ApiResponse> => {
  try {
    const res = await fetch(`${API}/product/${productId}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateProduct = async (
  productId: string,
  userId: string,
  product: FormData
): Promise<ApiResponse> => {
  try {
    const res = await fetch(`${API}/product/${productId}/${userId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
      },
      body: product,
    });
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};