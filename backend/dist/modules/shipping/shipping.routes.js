import express from "express";
import { getShippingRates, buyShippingLabel, trackShipment } from "./shipping.controller.js";
const router = express.Router();
// routes start with /api/shipping
router.post("/rates", getShippingRates);
router.post("/buy", buyShippingLabel);
router.get("/track/:trackingCode", trackShipment);
export default router;
