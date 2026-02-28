import * as EasyPost from "@easypost/api";
import { calculateParcel } from "./shipping.utils.js";
import { getLaPosteRates } from "./laposte.service.js";
import { createColissimoLabel } from "./laposte.label.js";
const client = new EasyPost.default(process.env.EASYPOST_API_KEY);
export const getShippingRates = async (req, res) => {
    try {
        const { toAddress, cartItems } = req.body;
        const parcel = calculateParcel(cartItems);
        const fromAddress = {
            street1: process.env.WAREHOUSE_STREET,
            city: process.env.WAREHOUSE_CITY,
            state: process.env.WAREHOUSE_STATE,
            zip: process.env.WAREHOUSE_ZIP,
            country: process.env.WAREHOUSE_COUNTRY,
        };
        // 1️⃣ EasyPost rates
        const shipment = await client.Shipment.create({
            to_address: toAddress,
            from_address: fromAddress,
            parcel,
        });
        const easyPostRates = shipment.rates;
        // 2️⃣ La Poste rates
        const laPosteRates = await getLaPosteRates(toAddress, cartItems, fromAddress);
        // 3️⃣ Merge rates
        const rates = [...laPosteRates, ...easyPostRates];
        return res.json({ rates });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to get shipping rates" });
    }
};
export const buyShippingLabel = async (req, res) => {
    try {
        const { rate, cartItems, toAddress } = req.body;
        const fromAddress = {
            street1: process.env.WAREHOUSE_STREET,
            city: process.env.WAREHOUSE_CITY,
            state: process.env.WAREHOUSE_STATE,
            zip: process.env.WAREHOUSE_ZIP,
            country: process.env.WAREHOUSE_COUNTRY,
        };
        // La Poste
        if (rate.carrier === "La Poste") {
            const label = await createColissimoLabel(cartItems, toAddress, fromAddress);
            return res.json(label);
        }
        // EasyPost fallback
        const boughtShipment = await client.Shipment.buy(rate.shipmentId, { id: rate.id });
        return res.json({
            labelUrl: boughtShipment.postage_label.label_url,
            trackingCode: boughtShipment.tracking_code
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to buy label" });
    }
};
// Track shipment (for both carriers)
export const trackShipment = async (req, res) => {
    try {
        const { trackingCode } = req.params;
        // EasyPost tracker
        const tracker = await client.Tracker.create({ tracking_code: trackingCode });
        return res.json(tracker);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to track shipment" });
    }
};
