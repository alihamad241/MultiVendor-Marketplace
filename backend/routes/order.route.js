import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getVendorOrders, updateOrderStatus, getOrderById } from "../controllers/order.controller.js";

const router = express.Router();

router.get("/vendor", protectRoute, getVendorOrders);
router.get("/:id", protectRoute, getOrderById);
router.patch("/:id/status", protectRoute, updateOrderStatus);

export default router;
