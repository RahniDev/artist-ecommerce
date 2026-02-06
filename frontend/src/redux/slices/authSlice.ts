import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IAuthData } from "../../types";

interface AuthState {
  user: IAuthData["user"] | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<IAuthData>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      // Persist to localStorage
      localStorage.setItem("jwt", JSON.stringify(action.payload));
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("jwt");
    },
    loadAuthFromStorage: (state) => {
      if (typeof window === "undefined") return;
      const stored = localStorage.getItem("jwt");
      if (stored) {
        try {
          const data: IAuthData = JSON.parse(stored);
          state.user = data.user;
          state.token = data.token;
          state.isAuthenticated = true;
        } catch {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      }
    },
  },
});

export const { setAuth, clearAuth, loadAuthFromStorage } = authSlice.actions;

export default authSlice.reducer;
