import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IProduct, CartItem } from "../../types";

const CART_KEY = "cart";

// Load cart from localStorage
const loadCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Save cart to localStorage
const saveCart = (cart: CartItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<IProduct>) => {
      const existing = state.items.find((item) => item._id === action.payload._id);
      if (!existing) {
        state.items.push({ ...action.payload, count: 1 });
      }
      saveCart(state.items);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      saveCart(state.items);
    },

    updateQuantity: (state, action: PayloadAction<{ productId: string; count: number }>) => {
      const { productId, count } = action.payload;
      const index = state.items.findIndex((item) => item._id === productId);
      if (index !== -1) {
        state.items[index].count = count;
      }
      saveCart(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveCart(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
