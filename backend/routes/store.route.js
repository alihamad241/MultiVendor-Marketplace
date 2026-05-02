import express from 'express';
import {
    getAllStores,
    createStore,
    deleteStore,
    getStoreById,
    getMyStore,
    getPendingStores,
    updateStoreStatus
} from '../controllers/store.controller.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getAllStores);
router.get('/my-store', protectRoute, getMyStore);
router.get('/pending', protectRoute, adminRoute, getPendingStores);
router.post('/', protectRoute, createStore);
router.get('/:id', getStoreById);
router.patch('/:id/status', protectRoute, adminRoute, updateStoreStatus);
router.delete('/:id', protectRoute, adminRoute, deleteStore);
// router.get('/featured', getFeaturedStores);
// router.get('/category/:category', getStoresByCategory);
// router.get('/recommendations', getRecommendedStores);
// router.patch('/:id', protectRoute, adminRoute, toggleFeaturedStore);

export default router;
