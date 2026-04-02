import * as EasyPost from "@easypost/api";
import { calculateParcel } from "./shipping.utils.js";
import { getLaPosteRates } from "./laposte.service.js";
import { createColissimoLabel } from "./laposte.label.js";

// Lazy init — only runs when a route is actually called
function getClient() {
    const apiKey = process.env.EASYPOST_API_KEY;
    if (!apiKey) throw new Error("EASYPOST_API_KEY is not set in .env");
    return new EasyPost.default(apiKey);
}

export const getShippingRates = async (req, res) => {
    try {
        const client = getClient(); 
        const { toAddress, cartItems } = req.body;
        const parcel = calculateParcel(cartItems);
        const fromAddress = {
            street1: process.env.WAREHOUSE_STREET,
            city: process.env.WAREHOUSE_CITY,
            state: process.env.WAREHOUSE_STATE,
            zip: process.env.WAREHOUSE_ZIP,
            country: process.env.WAREHOUSE_COUNTRY,
        };

        const shipment = await client.Shipment.create({
            to_address: toAddress,
            from_address: fromAddress,
            parcel,
        });
        const easyPostRates = shipment.rates;

        const laPosteRates = await getLaPosteRates(toAddress, cartItems, fromAddress);
        const rates = [...laPosteRates, ...easyPostRates];

        return res.json({ rates });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to get shipping rates" });
    }
};

export const buyShippingLabel = async (req, res) => {
    try {
        const client = getClient(); 
        const { rate, cartItems, toAddress } = req.body;
        const fromAddress = {
            street1: process.env.WAREHOUSE_STREET,
            city: process.env.WAREHOUSE_CITY,
            state: process.env.WAREHOUSE_STATE,
            zip: process.env.WAREHOUSE_ZIP,
            country: process.env.WAREHOUSE_COUNTRY,
        };

        if (rate.carrier === "La Poste") {
            const label = await createColissimoLabel(cartItems, toAddress, fromAddress);
            return res.json(label);
        }

        const boughtShipment = await client.Shipment.buy(rate.shipmentId, { id: rate.id });
        return res.json({
            labelUrl: boughtShipment.postage_label.label_url,
            trackingCode: boughtShipment.tracking_code,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to buy label" });
    }
};

export const trackShipment = async (req, res) => {
    try {
        const client = getClient();
        const { trackingCode } = req.params;
        const tracker = await client.Tracker.create({ tracking_code: trackingCode });
        return res.json(tracker);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to track shipment" });
    }
};