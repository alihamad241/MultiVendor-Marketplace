import express from 'express';
import {
    getAllProducts,
    getFeaturedProducts,
    createProduct,
    deleteProduct,
    getRecommendedProducts,
    getProductsByCategory,
    toggleFeaturedProduct,
    searchProductsAndStores,
    getProductById,
    updateProduct
} from '../controllers/product.controller.js';
import { protectRoute, vendorRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// router.get('/featured', getFeaturedProducts);
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProductsAndStores);
router.get('/category/:category', getProductsByCategory);
router.get('/recommendations', getRecommendedProducts);
router.get('/id/:id', getProductById); // Use /id/:id to avoid conflict with /:name (store)
router.post('/', protectRoute, vendorRoute, createProduct);
router.put('/:id', protectRoute, vendorRoute, updateProduct);
router.get('/:name', getAllProducts);
router.patch('/:id', protectRoute, vendorRoute, toggleFeaturedProduct);
router.delete('/:id', protectRoute, vendorRoute, deleteProduct);

export default router;
