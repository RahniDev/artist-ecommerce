import { API } from '../config';
import type { IOrder, IProduct, CategoryInput, Category, ApiResponse, Product } from '../types';
import { store } from '../redux/store';

const getCurrentLanguage = (): string => {
    try {
        const state = store.getState();
        return state.language?.currentLanguage || 'en';
    } catch (error) {
        console.warn('Could not get language from Redux, defaulting to en');
        return 'en';
    }
};

// Add language parameter to URL
const addLanguageParam = (url: string): string => {
    const lang = getCurrentLanguage();
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}lang=${lang}`;
};

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
): Promise<ApiResponse<IProduct>> => {
    try {
        const res = await fetch(`${API}/product/create/${userId}`, {
            method: 'POST',
            headers: {
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

        if (!res.ok) {
            return { error: "Failed to fetch categories" };
        }

        const categories: Category[] = await res.json();

        return { data: categories };
    } catch (err) {
        console.error(err);
        return { error: "Network error while fetching categories" };
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

export const getStatusValues = async (
    userId: string,
    token: string
): Promise<string[]> => {
    const res = await fetch(`/${API}/order/status-values/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.json();
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
        const url = addLanguageParam(`${API}/products?limit=undefined`);
        const res = await fetch(url);
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

export const updateProduct = async (
    productId: string,
    userId: string,
    token: string,
    productData: FormData
): Promise<ApiResponse<IProduct>> => {
    try {
        const res = await fetch(`${API}/product/${productId}/${userId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: productData,
        });
        const product: IProduct = await res.json();
        return { data: product };
    } catch (err) {
        return { error: "Update failed" };
    }
};