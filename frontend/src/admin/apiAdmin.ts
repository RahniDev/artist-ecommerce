import { API } from '../config';
import type { IOrder } from '../types';

export interface Category {
    _id: string;
    name: string;
}

export interface Product {
    [key: string]: any;
}

export interface ApiResponse<T = any> {
    error?: string;
    data?: T;
}

// used when creating a category
export interface CategoryInput {
    name: string;
}

export const createCategory = async (
    userId: string,
    token: string,
    category: CategoryInput
): Promise<ApiResponse<Category>> => {
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

export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
    try {
        const res = await fetch(`${API}/categories`);
        const data = await res.json();
        return data; // { error?: string, data?: Category[] }
    } catch (err) {
        console.error(err);
        return { error: "Failed to fetch categories" };
    }
};

export const listOrders = async (
    userId: string,
    token: string
): Promise<ApiResponse<IOrder[]>> => {
    try {
        const res = await fetch(`${API}/order/list/${userId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
        return { error: "Failed to fetch orders" };
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

export const getProducts = async (): Promise<ApiResponse<Product[]>> => {
    try {
        const res = await fetch(`${API}/products?limit=undefined`);
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
        return { error: "Failed to fetch products" };
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