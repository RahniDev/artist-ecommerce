import { calculateParcel } from "./shipping.utils.js";
// Calculate La Poste rates for a given parcel
export const getLaPosteRates = async (toAddress, cartItems, fromAddress) => {
    try {
        const parcel = calculateParcel(cartItems);
        const weightKg = parcel.weight / 1000;
        // Total order value (for insurance purposes)
        const totalValue = cartItems.reduce((sum, item) => sum + item.price * (item.count ?? 1), 0);
        // Hardcoded Colissimo International rate – adjust if you integrate real API later
        const rate = {
            id: "laposte_colissimo",
            carrier: "La Poste",
            service: "Colissimo International",
            rate: weightKg <= 0.5 ? "29.90" : "34.50",
            currency: "EUR",
            insuranceValue: totalValue,
            deliveryEstimate: "5-10 business days",
        };
        return [rate];
    }
    catch (err) {
        console.error("La Poste rates error:", err);
        return [];
    }
};
