import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Store from "../models/store.model.js";
import Product from "../models/product.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401);
        }

        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded.userId).select('-password');
            
            if (!user) {
                return res.status(401).json({ message: 'User not found.' });
            }

            req.user = user;
            next(); 
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired.' });
            }
            throw error;
        }
    } catch (error) {
        console.error("Error in protectRoute middleware:", error);
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

export const adminRoute = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access Denied. Admins only.' });
    }
};

export const ownerRoute = async (req, res, next) => {
    try {
        // User must be an owner
        if (!req.user || req.user.role !== "owner") {
            return res.status(403).json({ message: "Access Denied. Owners only." });
        }

        let storeId = null;

        // 1️⃣ Product creation → store id sent in body
        if (req.method === "POST") {
            storeId = req.body.store;
        }

        // 2️⃣ Updating/deleting product → find store from product id
        if ((req.method === "PATCH" || req.method === "DELETE") && req.params.id) {
            const product = await Product.findById(req.params.id);

            if (!product)
                return res.status(404).json({ message: "Product not found" });

            storeId = product.store;
        }

        if (!storeId)
            return res.status(400).json({ message: "Store ID missing" });

        // 3️⃣ Check if logged-in user owns this store
        const store = await Store.findById(storeId);

        if (!store)
            return res.status(404).json({ message: "Store not found" });

        if (store.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Access Denied. You do not own this store.",
            });
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};
