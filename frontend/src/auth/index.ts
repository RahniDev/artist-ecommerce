import { API } from "../config";

export interface IUser {
  name?: string;
  email: string;
  password: string;
}

export interface IAuthData {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: number;
  };
}

export const signup = async (user: IUser): Promise<any> => {
  try {
    const response = await fetch(`${API}/signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const signin = async (user: IUser): Promise<any> => {
  try {
    const response = await fetch(`${API}/signin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const authenticate = (data: IAuthData, next: () => void): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(data));
    next();
  }
};

export const signout = async (next: () => void): Promise<void> => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
    next();

    try {
      const response = await fetch(`${API}/signout`, { method: "GET" });
      console.log("signout", await response.json());
    } catch (err) {
      console.error(err);
    }
  }
};

export const isAuthenticated = (): IAuthData | false => {
  if (typeof window === "undefined") return false;
  const jwt = localStorage.getItem("jwt");
  return jwt ? JSON.parse(jwt) : false;
};