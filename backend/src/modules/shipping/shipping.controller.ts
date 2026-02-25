import { Request, Response } from "express";
import * as EasyPost from "@easypost/api";
import { calculateParcel } from "./shipping.utils.js";

const client = new (EasyPost as any).default(process.env.EASYPOST_API_KEY!);

export const getShippingRates = async (req: Request, res: Response) => {
  try {
    const { toAddress, cartItems } = req.body;

    const parcel = calculateParcel(cartItems);

    const fromAddress = {
      street1: process.env.WAREHOUSE_STREET!,
      city: process.env.WAREHOUSE_CITY!,
      state: process.env.WAREHOUSE_STATE!,
      zip: process.env.WAREHOUSE_ZIP!,
      country: process.env.WAREHOUSE_COUNTRY!,
    };

    const shipment = await client.Shipment.create({
      to_address: toAddress,
      from_address: fromAddress,
      parcel,
    });

    return res.json({ rates: shipment.rates });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to get shipping rates" });
  }
};

// Buy a shipping label
export const buyShippingLabel = async (req: Request, res: Response) => {
  try {
    const { shipmentId, rateId } = req.body;

    // Purchase the selected rate
    const boughtShipment = await client.Shipment.buy(shipmentId, { id: rateId });

    return res.json({
      labelUrl: boughtShipment.postage_label.label_url,
      trackingCode: boughtShipment.tracking_code,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to buy label" });
  }
};

// Track a shipment
export const trackShipment = async (req: Request, res: Response) => {
  try {
    const { trackingCode } = req.params;

    const tracker = await client.Tracker.create({ tracking_code: trackingCode });

    return res.json(tracker);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to track shipment" });
  }
};