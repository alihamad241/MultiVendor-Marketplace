import express from 'express';
import { getWishlistProducts, addToWishlist, removeAllFromWishlist, updateQuantity } from '../controllers/wishlist.controller.js';
import { protectRoute } from './../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getWishlistProducts);
router.post('/', protectRoute, addToWishlist);
router.delete('/', protectRoute, removeAllFromWishlist);
router.put('/:id', protectRoute, updateQuantity);

export default router;
