import Coupon from "../models/coupon.model.js";

const escapeRegExp = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getCoupon = async (req, res) => {
    try {
        // Return the most recent active coupon (global)
        const coupon = await Coupon.findOne({ isActive: true }).sort({ createdAt: -1 });
        res.json(coupon || null);
    } catch (error) {
        console.log("Error in getCoupon controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ message: "Code is required" });
        const normalized = String(code).trim();
        // use case-insensitive exact match to avoid issues with stored casing or invisible characters
        const coupon = await Coupon.findOne({ code: { $regex: `^${escapeRegExp(normalized)}$`, $options: "i" }, isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        if (coupon.expirationDate < new Date()) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(404).json({ message: "Coupon expired" });
        }

        res.json({
            message: "Coupon is valid",
            code: coupon.code,
            discountPercentage: coupon.discountPercentage,
        });
    } catch (error) {
        console.log("Error in validateCoupon controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const createCoupon = async (req, res) => {
    try {
        const { code, discountPercentage, expirationDate } = req.body;

        if (!code || !discountPercentage || !expirationDate) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // normalize and validate inputs
        // trim, remove common invisible/zero-width characters, then uppercase for storage
        const normalizedCode = String(code)
            .trim()
            .replace(/[\u200B-\u200D\uFEFF]/g, "")
            .toUpperCase();
        console.info("createCoupon payload", { code: String(code), normalizedCode, discountPercentage, expirationDate });
        const discount = Number(discountPercentage);
        if (Number.isNaN(discount) || discount < 0 || discount > 100) {
            return res.status(400).json({ message: "discountPercentage must be a number between 0 and 100" });
        }
        const exp = new Date(expirationDate);
        if (isNaN(exp.getTime())) {
            return res.status(400).json({ message: "Invalid expirationDate" });
        }
        if (exp <= new Date()) {
            return res.status(400).json({ message: "expirationDate must be in the future" });
        }

        // ensure unique code only (case-insensitive)
        const existing = await Coupon.findOne({ code: { $regex: `^${escapeRegExp(normalizedCode)}$`, $options: "i" } });
        if (existing) {
            console.warn("createCoupon: duplicate code detected", { normalizedCode, existingCode: existing.code });
            return res
                .status(409)
                .json({
                    message: "A coupon with this code already exists - 1",
                    existing: { code: existing.code, isActive: existing.isActive },
                });
        }

        const coupon = new Coupon({ code: normalizedCode, discountPercentage: discount, expirationDate: exp, isActive: true });

        try {
            await coupon.save();
            res.status(201).json(coupon);
        } catch (saveErr) {
            // handle duplicate key at DB level (race)
            console.error(
                "createCoupon save error",
                saveErr && saveErr.code ? { code: saveErr.code, keyValue: saveErr.keyValue } : saveErr?.message || saveErr
            );
            if (saveErr && saveErr.code === 11000) {
                return res
                    .status(409)
                    .json({ message: "A coupon with this code already exists - 2", dbError: { code: saveErr.code, keyValue: saveErr.keyValue } });
            }
            throw saveErr;
        }
    } catch (error) {
        console.error("Error in createCoupon controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const listCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        console.error("Error in listCoupons controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deactivateCoupon = async (req, res) => {
    try {
        const { code } = req.params;
        const normalized = String(code || "").trim();
        // .toUpperCase(); // Removed to allow case-insensitive regex
        const coupon = await Coupon.findOneAndUpdate(
            { code: { $regex: `^${escapeRegExp(normalized)}$`, $options: "i" } },
            { isActive: false },
            { new: true }
        );
        if (!coupon) return res.status(404).json({ message: "Coupon not found" });
        res.json({ message: "Coupon deactivated", coupon });
    } catch (error) {
        console.error("Error in deactivateCoupon controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
