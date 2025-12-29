import { API } from "../config";
import type { IUser, IAuthData, IOrder, ApiResponse } from "../types";

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

    const user: IUser = await res.json();
    return { data: user };
  } catch (err: any) {
    return { error: err?.message || "Failed to read user" };
  }
};

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

    const updatedUser: IUser = await res.json();
    return { data: updatedUser };
  } catch (err: any) {
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
): Promise<ApiResponse<IOrder[]>> => {
  try {
    const res = await fetch(`${API}/orders/by/user/${userId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return { error: `API error: ${res.status} - ${text}` };
    }

    const orders: IOrder[] = await res.json();
    return { data: orders };
  } catch (err: any) {
    return { error: err?.message || "Failed to load purchase history" };
  }
};
