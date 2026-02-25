import express from "express";
import {
  getShippingRates,
  buyShippingLabel,
  trackShipment,
} from "./shipping.controller.js";

const router = express.Router();

// POST /api/shipping/rates
router.post("/rates", getShippingRates);

// POST /api/shipping/buy
router.post("/buy", buyShippingLabel);

// GET /api/shipping/track/:trackingCode
router.get("/track/:trackingCode", trackShipment);

export default router;