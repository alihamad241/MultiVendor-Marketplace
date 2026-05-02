import { redis } from "../libs/redis.js";
import Product from "../models/product.model.js";
import Store from "../models/store.model.js";
import User from "../models/user.model.js";
import cloudinary from "./../libs/cloudinary.js";

export const getAllStores = async (req, res) => {
    try {
        const stores = await Store.find({ status: "approved" }).populate("owner", "name email");
        res.status(200).json({ stores });
    } catch (error) {
        res.status(500).json({ message: "Error fetching stores", error });
    }
};

export const getStoreById = async (req, res) => {
    try {
        const store = await Store.findById(req.params.id).populate("owner", "name email");
        if (!store) return res.status(404).json({ message: "Store not found" });

        const products = await Product.find({ store: req.params.id });
        res.status(200).json({ store, products });
    } catch (error) {
        res.status(500).json({ message: "Error fetching store details", error });
    }
};

export const getFeaturedStores = async (req, res) => {
    try {
        const cached = await redis.get("featured_stores");
        if (cached) {
            return res.status(200).json(JSON.parse(cached));
        }

        const featuredStores = await Store.find({ isFeatured: true }).lean();

        if (!featuredStores || featuredStores.length === 0) {
            return res.status(200).json([]);
        }

        // Cache results and set TTL for 1 hour
        await redis.set("featured_stores", JSON.stringify(featuredStores), "EX", 60 * 60);
        res.json(featuredStores);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching featured stores",
            error,
        });
    }
};

export const createStore = async (req, res) => {
    try {
        const { name, description, image } = req.body;
        const ownerId = req.user._id;

        let cloudinaryResponse = null;

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, {
                folder: "stores",
            });
        }

        const store = await Store.create({
            name,
            description,
            logo_image: cloudinaryResponse?.secure_url || "",
            owner: ownerId,
            status: "pending"
        });

        res.status(201).json(store);
    } catch (error) {
        res.status(500).json({ message: "Error creating store", error });
    }
};

export const deleteStore = async (req, res) => {
    try {
        const store = await Store.findById(req.params.id);

        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }

        if (store.image) {
            const publicId = store.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`stores/${publicId}`);
                console.log("Image deleted from Cloudinary");
            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error);
            }
        }

        const wasFeatured = !!store.isFeatured;
        await Store.findByIdAndDelete(req.params.id);

        if (wasFeatured) {
            await updateFeaturedStoresCache();
        }

        res.json({ message: "Store deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting store", error: error.message });
    }
};

export const getMyStore = async (req, res) => {
    try {
        const store = await Store.findOne({ owner: req.user._id });
        if (!store) return res.status(404).json({ message: "Store not found" });
        res.status(200).json(store);
    } catch (error) {
        res.status(500).json({ message: "Error fetching your store", error: error.message });
    }
};

export const getRecommendedStores = async (req, res) => {
    try {
        const stores = await Store.aggregate([
            {
                $sample: { size: 10 },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1,
                },
            },
        ]);

        res.json(stores);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching recommended stores",
            error,
        });
    }
};

export const getStoresByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const stores = await Store.find({ category: category });

        res.json({ stores });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching stores by category",
            error,
        });
    }
};

export const toggleFeaturedStore = async (req, res) => {
    try {
        const store = await Store.findById(req.params.id);
        if (store) {
            store.isFeatured = !store.isFeatured;
            const updatedStore = await store.save();
            await updateFeaturedStoresCache();
            res.json(updatedStore);
        } else {
            res.status(404).json({ message: "Store not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating store", error });
    }
};

export const getPendingStores = async (req, res) => {
    try {
        const stores = await Store.find({ status: "pending" }).populate("owner", "name email");
        res.status(200).json({ stores });
    } catch (error) {
        res.status(500).json({ message: "Error fetching pending stores", error });
    }
};

export const updateStoreStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const store = await Store.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!store) return res.status(404).json({ message: "Store not found" });

        // If approved, ensure user has vendor role
        if (status === "approved") {
            await User.findByIdAndUpdate(store.owner, { role: "vendor" });
        }

        res.status(200).json(store);
    } catch (error) {
        res.status(500).json({ message: "Error updating store status", error });
    }
};

async function updateFeaturedStoresCache() {
    try {
        const featuredStores = await Store.find({
            isFeatured: true,
        }).lean();
        await redis.set("featured_stores", JSON.stringify(featuredStores), "EX", 60 * 60);
    } catch (error) {
        console.error("Error updating featured stores cache:", error);
    }
}
