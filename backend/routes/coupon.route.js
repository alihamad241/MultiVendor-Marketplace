import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { getCoupon, validateCoupon, createCoupon, listCoupons, deactivateCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protectRoute, getCoupon);
router.post("/validate", protectRoute, validateCoupon);

// Admin endpoints
router.post("/admin/create", protectRoute, adminRoute, createCoupon);
router.get("/admin", protectRoute, adminRoute, listCoupons);
router.delete("/admin/:code", protectRoute, adminRoute, deactivateCoupon);

export default router;
