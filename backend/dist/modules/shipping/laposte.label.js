import axios from "axios";
import { calculateParcel } from "./shipping.utils.js";
export const createColissimoLabel = async (cartItems, toAddress, fromAddress) => {
    const parcel = calculateParcel(cartItems);
    const weightKg = parcel.weight / 1000;
    const totalValue = cartItems.reduce((sum, item) => sum + item.price * item.count, 0);
    // Build customs declaration articles
    const articles = cartItems.map(item => ({
        description: item.name,
        quantity: item.count,
        weight: (item.weight * item.count) / 1000, // kg
        value: item.price * item.count,
        currency: "EUR",
        originCountry: "FR",
        hsCode: item.hsCode || "970110", // painting default HS code
    }));
    const payload = {
        contractNumber: process.env.LAPOSTE_LOGIN,
        password: process.env.LAPOSTE_PASSWORD,
        outputFormat: {
            outputPrintingType: "PDF_A4_300dpi"
        },
        letter: {
            service: {
                productCode: "COLI",
                depositDate: new Date().toISOString().split("T")[0],
            },
            parcel: {
                weight: weightKg,
                insuranceValue: totalValue // dynamic insurance
            },
            sender: {
                zipCode: fromAddress.zip,
                countryCode: fromAddress.country
            },
            addressee: {
                zipCode: toAddress.zip,
                countryCode: toAddress.country
            },
            customsDeclarations: {
                contents: {
                    article: articles
                }
            }
        }
    };
    const response = await axios.post(`${BASE_URL}/generateLabel`, payload, {
        headers: {
            "Content-Type": "application/json",
            "X-Okapi-Key": process.env.LAPOSTE_API_KEY
        }
    });
    return {
        labelUrl: response.data.label,
        trackingCode: response.data.trackingNumber
    };
};
