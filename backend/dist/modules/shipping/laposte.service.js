import { calculateParcel } from "./shipping.utils.js";
const BASE_URL = "https://ws.colissimo.fr/sls-ws/SlsServiceWSRest";
export const getLaPosteRates = async (toAddress, cartItems, fromAddress) => {
    try {
        const parcel = calculateParcel(cartItems);
        const weightKg = parcel.weight / 1000;
        // Fake rate calculation; adjust if you want real API calculation
        const totalValue = cartItems.reduce((sum, item) => sum + item.price * item.count, 0);
        const rates = [
            {
                id: "laposte_colissimo",
                carrier: "La Poste",
                service: "Colissimo International",
                rate: (weightKg <= 0.5 ? 29.9 : 34.5).toFixed(2),
                currency: "EUR",
                insuranceValue: totalValue, // send along for later label creation
            },
        ];
        return rates;
    }
    catch (err) {
        console.error("La Poste rates error:", err);
        return [];
    }
};
