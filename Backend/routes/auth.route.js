import express from 'express';
import { login, logout, signup, refreshToken } from '../controllers/auth.controller.js';
import { getProfile, getOrders, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.get('/profile', protectRoute, getProfile);
router.get('/orders', protectRoute, getOrders);
router.put("/profile", protectRoute, updateProfile);


export default router;
