
export interface CartItem {
    _id: string;
    name: string;
    price: number;
    count: number;
    [key: string]: any; // Allows additional fields (category, description, etc.)
}

const CART_KEY = "cart";

// read from localStorage
const getLocalCart = (): CartItem[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
};

const saveLocalCart = (cart: CartItem[]): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addItem = (
    item: Omit<CartItem, "count">,
    count: number = 1,
    next: () => void = () => { }
): void => {
    const cart = getLocalCart();

    const existing = cart.find((p) => p._id === item._id);

    if (existing) {
        existing.count += count;
    } else {
        cart.push({ ...item, count });
    }

    saveLocalCart(cart);
    next();
};

export const itemTotal = (): number => {
    return getLocalCart().length;
};

export const getCart = (): CartItem[] => {
    return getLocalCart();
};

export const updateItem = (productId: string, count: number): void => {
    const cart = getLocalCart();

    const index = cart.findIndex((p) => p._id === productId);
    if (index !== -1) {
        cart[index].count = count;
    }

    saveLocalCart(cart);
};

export const removeItem = (productId: string): CartItem[] => {
    const cart = getLocalCart();

    const filtered = cart.filter((p) => p._id !== productId);

    saveLocalCart(filtered);
    return filtered;
};

export const emptyCart = (next: () => void = () => { }): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CART_KEY);
    next();
};