import type { IProduct } from "../types";

export interface CartItem extends IProduct {
  count: number;
}

const CART_KEY = "cart";

// Read from localStorage
const getLocalCart = (): CartItem[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
};

// Save to localStorage
const saveLocalCart = (cart: CartItem[]): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

// Add item to cart
export const addItem = (
    product: IProduct,
    next?: () => void
): void => {
    let cart = getLocalCart();

    // Prevent duplicates — optional, but recommended
    const existing = cart.find((item) => item._id === product._id);
    if (!existing) {
        cart.push({ ...product, count: 1 });
    }

    saveLocalCart(cart);

    if (next) next();
};

// Total items count
export const itemTotal = (): number => {
    return getLocalCart().reduce((sum, item) => sum + item.count, 0);
};

// Get whole cart
export const getCart = (): CartItem[] => {
    return getLocalCart();
};

// Update quantity
export const updateItem = (productId: string, count: number): void => {
    const cart = getLocalCart();

    const index = cart.findIndex((p) => p._id === productId);
    if (index !== -1) {
        cart[index].count = count;
    }

    saveLocalCart(cart);
};

// Remove item
export const removeItem = (productId: string): CartItem[] => {
    const cart = getLocalCart();
    const filtered = cart.filter((p) => p._id !== productId);

    saveLocalCart(filtered);
    return filtered;
};

// Clear cart
export const emptyCart = (next: () => void = () => {}): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CART_KEY);
    next();
};
