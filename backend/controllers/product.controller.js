import { redis } from "../libs/redis.js";
import Product from "../models/product.model.js";
import Store from "../models/store.model.js";
import cloudinary from "./../libs/cloudinary.js";

export const getAllProducts = async (req, res) => {
    try {
        const { storeName } = req.params;
        const { category, gender } = req.query;
        let products;

        if (storeName) {
            // find store by name (case-insensitive)
            const store = await Store.findOne({
                name: { $regex: `^${storeName}$`, $options: "i" },
            });

            if (!store) {
                return res.status(404).json({ message: "Store not found" });
            }

            // get products using the store's ObjectId
            products = await Product.find({ store: store._id });
        } else {
            // support optional query filters
            const filter = {};
            if (category) filter.category = { $regex: `^${category}$`, $options: "i" };
            if (gender) filter.gender = { $regex: `^${gender}$`, $options: "i" };
            products = await Product.find(filter);
        }

        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
};

export const getFeaturedProducts = async (req, res) => {
    try {
        const cached = await redis.get("featured_products");
        if (cached) {
            return res.status(200).json(JSON.parse(cached));
        }

        const featuredProducts = await Product.find({ isFeatured: true }).lean();

        if (!featuredProducts || featuredProducts.length === 0) {
            return res.status(200).json([]);
        }

        // Cache for 1 hour (set TTL) to avoid stale forever cache
        await redis.set("featured_products", JSON.stringify(featuredProducts), "EX", 60 * 60);
        res.json(featuredProducts);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching featured products",
            error,
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category, gender, storeName } = req.body;

        let cloudinaryResponse = null;

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, {
                folder: "products",
            });
        }

        // find store by name (case-insensitive)
        const store = await Store.findOne({
            name: { $regex: `^${storeName}$`, $options: "i" },
        });

        // validate required inputs
        if (!name || !description || !price || !category || !storeName) {
            return res.status(400).json({ message: "Missing required product fields" });
        }

        if (!store) {
            return res.status(400).json({ message: "Store not found" });
        }

        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category,
            gender,
            store: store._id,
        });

        // if this product is featured, refresh the featured cache
        if (product.isFeatured) {
            await updateFeaturedProductsCache();
        }

        res.status(201).json({ product });
    } catch (error) {
        // Handle mongoose validation errors with a 400 and readable message
        if (error && error.name === "ValidationError") {
            const messages = Object.values(error.errors)
                .map((e) => e.message)
                .join(", ");
            return res.status(400).json({ message: messages });
        }

        console.error("createProduct error:", error);
        res.status(500).json({ message: "Error creating product", error: error?.message || error });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("Image deleted from Cloudinary");
            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error);
            }
        }

        const wasFeatured = !!product.isFeatured;
        await Product.findByIdAndDelete(req.params.id);

        // If a featured product was removed, refresh the featured cache immediately
        if (wasFeatured) {
            await updateFeaturedProductsCache();
        }

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
};

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
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

        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching recommended products",
            error,
        });
    }
};

export const getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        // case-insensitive match
        const products = await Product.find({ category: { $regex: `^${category}$`, $options: "i" } });

        res.json({ products });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching products by category",
            error,
        });
    }
};

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updateFeaturedProductsCache();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
};

async function updateFeaturedProductsCache() {
    try {
        const featuredProducts = await Product.find({
            isFeatured: true,
        }).lean();
        // Set with a TTL so the cache expires even if updates are missed
        await redis.set("featured_products", JSON.stringify(featuredProducts), "EX", 60 * 60);
    } catch (error) {
        console.error("Error updating featured products cache:", error);
    }
}
