import express from 'express';
import {
    getAllStores,
    createStore,
    deleteStore
    // getFeaturedStores,
    // getRecommendedStores,
    // getStoresByCategory,
    // toggleFeaturedStore
} from '../controllers/store.controller.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getAllStores);
router.post('/', protectRoute, adminRoute, createStore);
router.delete('/:id', protectRoute, adminRoute, deleteStore);
// router.get('/featured', getFeaturedStores);
// router.get('/category/:category', getStoresByCategory);
// router.get('/recommendations', getRecommendedStores);
// router.patch('/:id', protectRoute, adminRoute, toggleFeaturedStore);

export default router;
