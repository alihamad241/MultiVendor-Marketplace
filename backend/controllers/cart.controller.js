async function buildCartResponse(user) {
    const productIds = user.cartItems.map((item) => item.product && item.product.toString()).filter(Boolean);
    const products = await Product.find({ _id: { $in: productIds } });

    const cartItems = user.cartItems.map((item) => {
        const product = products.find((p) => p._id.toString() === item.product.toString());
        if (!product) return null;
        return {
            ...product.toJSON(),
            quantity: item.quantity,
            selectedSize: item.size,
            cartItemId: item._id // helpful for differentiating same product with different sizes
        };
    }).filter(Boolean);

    return cartItems;
}
import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
    try {
        const { productId, size } = req.body;
        const user = req.user;

        // Find if this product with THIS size already exists in the user's cart
        const existingItem = user.cartItems.find((item) => {
            return item.product && item.product.toString() === productId && (item.size === size || (!item.size && !size));
        });

        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 0) + 1;
        } else {
            // push a subdocument with product reference, size, and initial quantity
            user.cartItems.push({ product: productId, quantity: 1, size: size || "" });
        }

        await user.save();
        const cartItems = await buildCartResponse(user);
        res.json(cartItems);
    } catch (error) {
        console.error("Error in addToCart:", error);
        res.status(500).json({ message: "Error adding to cart", error });
    }
};

export const removeAllFromCart = async (req, res) => {
    try {
        const { productId, cartItemId } = req.body;
        const user = req.user;

        if (!productId && !cartItemId) {
            // Clear entire cart
            user.cartItems = [];
        } else {
            // Remove items whose product id or cartItemId matches
            user.cartItems = user.cartItems.filter((item) => {
                if (cartItemId) return item._id.toString() !== cartItemId;
                return !(item.product && item.product.toString() === productId);
            });
        }

        await user.save();
        const cartItems = await buildCartResponse(user);
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: "Error removing from cart", error });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const { id: itemId } = req.params; // Can be cartItemId or productId
        const { quantity } = req.body;
        const user = req.user;
        
        const existingItem = user.cartItems.find((item) => 
            item._id.toString() === itemId || (item.product && item.product.toString() === itemId)
        );

        if (existingItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter((item) => item._id.toString() !== existingItem._id.toString());
                await user.save();
                const cartItems = await buildCartResponse(user);
                return res.json(cartItems);
            }

            existingItem.quantity = quantity;
            await user.save();
            const cartItems = await buildCartResponse(user);
            res.json(cartItems);
        } else {
            res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating quantity", error });
    }
};

export const getCartProducts = async (req, res) => {
    try {
        // Collect product ids referenced in the user's cart
        const productIds = req.user.cartItems.map((item) => item.product && item.product.toString()).filter(Boolean);
        const products = await Product.find({ _id: { $in: productIds } });

        // Map product documents to include the quantity from the user's cart
        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find((cartItem) => cartItem.product && cartItem.product.toString() === product._id.toString());
            return {
                ...product.toJSON(),
                quantity: item ? item.quantity : 1,
            };
        });
        // console.log(cartItems);

        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching cart products",
            error,
        });
    }
};
