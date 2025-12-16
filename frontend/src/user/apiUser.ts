import { API } from "../config";
import type { IUser, IAuthData, IOrder } from "../types";

export type ApiResponse<T> =
    | { error: string }
    | (T & { error?: undefined });

export const read = async (
    userId: string,
    token?: string | null
): Promise<ApiResponse<IUser>> => {
    try {
        const res = await fetch(`${API}/user/${userId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });

        return (await res.json()) as ApiResponse<IUser>;
    } catch (err: any) {
        console.error("read user error:", err);
        return { error: err?.message || "Failed to read user" };
    }
};

/**
 * Update user profile on server
 */
export const update = async (
    userId: string,
    token: string | null | undefined,
    user: Partial<IUser>
): Promise<ApiResponse<IUser>> => {
    try {
        const res = await fetch(`${API}/user/${userId}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(user),
        });

        return (await res.json()) as ApiResponse<IUser>;
    } catch (err: any) {
        console.error("update user error:", err);
        return { error: err?.message || "Failed to update user" };
    }
};

/* Update user stored in localStorage (jwt) */
export const updateUser = (
    user: Partial<IUser>,
    next?: () => void
): void => {
    if (typeof window === "undefined") return;

    try {
        const stored = localStorage.getItem("jwt");
        if (!stored) return;

        const auth: IAuthData = JSON.parse(stored) as IAuthData;

        // merge updated fields into auth.user (do not overwrite token)
        auth.user = { ...auth.user, ...user } as IUser;

        localStorage.setItem("jwt", JSON.stringify(auth));
        if (typeof next === "function") next();
    } catch (err) {
        console.error("updateUser localStorage error:", err);
    }
};

export const getPurchaseHistory = async (
    userId: string,
    token?: string | null
): Promise<ApiResponse<{ orders: IOrder[] } | IOrder[]>> => {
    try {
        const res = await fetch(`${API}/orders/by/user/${userId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });

        const parsed = await res.json();
        return parsed;
    } catch (err: any) {
        console.error("getPurchaseHistory error:", err);
        return { error: err?.message || "Failed to load purchase history" };
    }
};