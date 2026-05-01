import Product from '../models/product.model.js';

export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        const existingItem = user.wishlist.find(
            (item) => item.id === productId
        );
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.wishlist.push(productId);
        }

        await user.save();
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Error adding to wishlist', error });
    }
};

export const removeAllFromWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        if (!productId) {
            user.wishlist = [];
        } else {
            user.wishlist = user.wishlist.filter(
                (item) => item.id !== productId
            );
        }

        await user.save();
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Error removing from wishlist', error });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;
        const existingItem = user.wishlist.find(
            (item) => item.id === productId
        );
        if (existingItem) {
            if (quantity === 0) {
                user.wishlist = user.wishlist.filter(
                    (item) => item.id !== productId
                );
                await user.save();
                return res.json(user.wishlist);
            }

            existingItem.quantity = quantity;
            await user.save();
            res.json(user.wishlist);
        } else {
            res.status(404).json({ message: 'Product not found in wishlist' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating quantity', error });
    }
};

export const getWishlistProducts = async (req, res) => {
    try {
        const productIds = req.user.wishlist.map((item) => item._id);
        const products = await Product.find({ _id: { $in: productIds } });

        const wishlistItems = products.map((product) => {
            const item = req.user.wishlist.find(
                (wishlistItem) => wishlistItem._id.toString() === product._id.toString()
            );
            return {
                ...product.toJSON(),
                quantity: item.quantity
            };
        });
        // console.log(wishlistItems);

        res.status(200).json(wishlistItems);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching wishlist products',
            error
        });
    }
};
