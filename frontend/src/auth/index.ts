import { API } from "../config";
import type { IAuthData } from "../types";

export const signup = async (user: any): Promise<IAuthData | { error: string }> => {
    try {
        const response = await fetch(`${API}/signup`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });
        return response.json();
    } catch (err) {
        console.log(err);
        return { error: "Signup failed" };
    }
};

export const signin = async (user: any): Promise<IAuthData | { error: string }> => {
    try {
        const response = await fetch(`${API}/signin`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });
        return response.json();
    } catch (err) {
        console.log(err);
        return { error: "Signin failed" };
    }
};

// Save auth data to localStorage
export const authenticate = (data: IAuthData, next: () => void) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("jwt", JSON.stringify(data));
        next();
    }
};

// Remove auth data from localStorage
export const signout = (next: () => void) => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("jwt");
        next();
        fetch(`${API}/signout`, { method: "GET" })
            .then((response) => console.log("signout", response))
            .catch((err) => console.log(err));
    }
};

// Get auth data from localStorage
export const isAuthenticated = (): IAuthData | null => {
    if (typeof window === "undefined") return null;

    const stored = localStorage.getItem("jwt");
    if (!stored) return null;

    try {
        return JSON.parse(stored) as IAuthData;
    } catch {
        return null;
    }
};

