import type { CartItem } from "./shipping.utils.js";
import { calculateParcel } from "./shipping.utils.js";

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
}

export interface LaPosteRate {
  id: string;
  carrier: string;  // "La Poste"
  service: string;  // e.g., "Colissimo International"
  rate: string;     // e.g., "25.00"
  currency: string; // e.g., "EUR"
  insuranceValue: number;
  deliveryEstimate: string;
}

// Calculate La Poste rates for a given parcel
export const getLaPosteRates = async (
  toAddress: Address,
  cartItems: CartItem[],
  fromAddress: Address
): Promise<LaPosteRate[]> => {
  try {
    const parcel = calculateParcel(cartItems);
    const weightKg = parcel.weight / 1000;

    // Total order value (for insurance purposes)
    const totalValue = cartItems.reduce(
      (sum, item) => sum + item.price * (item.count ?? 1),
      0
    );

    // Hardcoded Colissimo International rate – adjust if you integrate real API later
    const rate: LaPosteRate = {
      id: "laposte_colissimo",
      carrier: "La Poste",
      service: "Colissimo International",
      rate: weightKg <= 0.5 ? "29.90" : "34.50",
      currency: "EUR",
      insuranceValue: totalValue,
      deliveryEstimate: "5-10 business days",
    };

    return [rate];
  } catch (err) {
    console.error("La Poste rates error:", err);
    return [];
  }
};