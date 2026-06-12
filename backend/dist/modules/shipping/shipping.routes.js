import express from "express";
import { getShippingRates, buyShippingLabel, trackShipment } from "./shipping.controller.js";
const router = express.Router();
// Get shipping rates for cart + destination
router.post("/rates", getShippingRates);
// Buy a shipping label for selected rate
router.post("/buy", buyShippingLabel);
// Track a shipment by tracking number
router.get("/track/:trackingCode", trackShipment);
export default router;
