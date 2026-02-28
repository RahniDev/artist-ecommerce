import { Request, Response } from "express";
import fetch from "node-fetch";
import { calculateParcel } from "./shipping.utils.js";
import { createColissimoLabel } from "./laposte.label.js";

const LAPOSTE_API_KEY = process.env.LAPOSTE_API_KEY!;
const LAPOSTE_TRACKING_URL = process.env.LAPOSTE_TRACKING_URL!;

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  count?: number;
  hsCode?: string;
}

interface Address {
  street1: string;
  street2?: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
}

interface LaPosteTrackingEvent {
  date?: string;
  label?: string;
  status?: string;
}

interface LaPosteTrackingResponse {
  shipment?: {
    status?: string;
    timeline?: LaPosteTrackingEvent[];
  };
}

export const getShippingRates = async (req: Request, res: Response) => {
  try {
    const { cartItems, toAddress } = req.body;

    if (!cartItems || !toAddress) {
      return res.status(400).json({ error: "Missing cartItems or toAddress" });
    }

    const parcel = calculateParcel(cartItems);
    const weightKg = parcel.weight / 1000;

    // Later replace this with real Colissimo contract pricing
    const rate = {
      id: "laposte_colissimo_standard",
      carrier: "La Poste",
      service: "Colissimo International",
      rate: weightKg <= 1 ? "25.00" : "35.00",
      currency: "EUR",
      type: "STANDARD",
      deliveryEstimate: "3-8 business days",
    };

    return res.json({ rates: [rate] });

  } catch (err) {
    console.error("Rate error:", err);
    return res.status(500).json({ error: "Failed to fetch shipping rates" });
  }
};

export const buyShippingLabel = async (req: Request, res: Response) => {
  try {
    const { cartItems, toAddress } = req.body;

    if (!cartItems || !toAddress) {
      return res.status(400).json({ error: "Missing shipping data" });
    }

    const fromAddress: Address = {
      street1: process.env.STORE_STREET!,
      city: process.env.STORE_CITY!,
      state: process.env.STORE_STATE,
      zip: process.env.STORE_ZIP!,
      country: process.env.STORE_COUNTRY!,
    };

    const label = await createColissimoLabel(
      cartItems,
      toAddress,
      fromAddress
    );

    return res.json({
      success: true,
      carrier: "La Poste",
      trackingCode: label.trackingCode,
      labelUrl: label.labelUrl,
    });

  } catch (err) {
    console.error("Buy label error:", err);
    return res.status(500).json({ error: "Failed to buy shipping label" });
  }
};

export const trackShipment = async (req: Request, res: Response) => {
  try {
    const { trackingCode } = req.params;

    if (!trackingCode) {
      return res.status(400).json({ error: "Missing trackingCode" });
    }

    const response = await fetch(
      `${LAPOSTE_TRACKING_URL}/${trackingCode}`,
      {
        headers: {
          "X-Okapi-Key": LAPOSTE_API_KEY,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: `La Poste API returned status ${response.status}: ${response.statusText}`,
      });
    }

    const data = (await response.json()) as LaPosteTrackingResponse;

    if (!data.shipment) {
      return res.status(404).json({
        error: "Invalid or unknown tracking number",
        trackingCode,
      });
    }

    if (!data.shipment.timeline || data.shipment.timeline.length === 0) {
      return res.status(404).json({
        error: "Tracking number exists but no events found yet",
        trackingCode,
      });
    }

    return res.json({
      carrier: "La Poste",
      trackingCode,
      status: data.shipment.status || "Unknown",
      events: data.shipment.timeline,
    });

  } catch (err) {
    console.error("Tracking error:", err);
    return res.status(500).json({ error: "Failed to track shipment" });
  }
};