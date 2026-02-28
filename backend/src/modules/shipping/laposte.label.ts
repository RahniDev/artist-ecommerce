// La Poste Label Service
import axios from "axios";
import { calculateParcel, CartItem } from "./shipping.utils.js";

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
}

export interface LaPosteLabelResponse {
  labelUrl: string;
  trackingCode: string;
}

export const createColissimoLabel = async (
  cartItems: CartItem[],
  toAddress: Address,
  fromAddress: Address
): Promise<LaPosteLabelResponse> => {
  try {
    const parcel = calculateParcel(cartItems);
    const weightKg = parcel.weight / 1000;

    const totalValue = cartItems.reduce(
      (sum, item) => sum + item.price * (item.count ?? 1),
      0
    );

    // Build customs declaration articles
    const articles = cartItems.map(item => ({
      description: item.name,
      quantity: item.count ?? 1,
      weight: ((item.weight ?? 500) * (item.count ?? 1)) / 1000, // kg
      value: item.price * (item.count ?? 1),
      currency: "EUR",
      originCountry: "FR",
      hsCode: item.hsCode || "970110", // default HS code for paintings
    }));

    const payload = {
      contractNumber: process.env.LAPOSTE_LOGIN,
      password: process.env.LAPOSTE_PASSWORD,
      outputFormat: {
        outputPrintingType: "PDF_A4_300dpi",
      },
      letter: {
        service: {
          productCode: "COLI",
          depositDate: new Date().toISOString().split("T")[0],
        },
        parcel: {
          weight: weightKg,
          insuranceValue: totalValue, // dynamic insurance
        },
        sender: {
          street1: fromAddress.street1,
          street2: fromAddress.street2,
          city: fromAddress.city,
          zipCode: fromAddress.zip,
          countryCode: fromAddress.country,
        },
        addressee: {
          street1: toAddress.street1,
          street2: toAddress.street2,
          city: toAddress.city,
          zipCode: toAddress.zip,
          countryCode: toAddress.country,
        },
        customsDeclarations: {
          contents: {
            article: articles,
          },
        },
      },
    };

    const BASE_URL = "https://api.laposte.fr/sls-ws/SlsServiceWSRest";

    const response = await axios.post(`${BASE_URL}/generateLabel`, payload, {
      headers: {
        "Content-Type": "application/json",
        "X-Okapi-Key": process.env.LAPOSTE_API_KEY!,
      },
    });

    if (!response.data?.label || !response.data?.trackingNumber) {
      throw new Error("Invalid response from La Poste API");
    }

    return {
      labelUrl: response.data.label,
      trackingCode: response.data.trackingNumber,
    };
  } catch (err) {
    console.error("La Poste label creation error:", err);
    throw new Error("Failed to create La Poste shipping label");
  }
};