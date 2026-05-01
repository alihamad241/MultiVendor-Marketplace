import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
    checkoutSuccess,
    createCheckoutSession,
    stripeWebhook,
    createOrderFromSession
} from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/create-checkout-session', protectRoute, createCheckoutSession);
router.post('/checkout-success', protectRoute, checkoutSuccess);

// Stripe webhook endpoint: must receive the raw body for signature verification.
// We mount express.raw({ type: 'application/json' }) for this specific route.
router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    stripeWebhook
);

// Public fallback to create order synchronously from session id (useful when webhooks
// are not configured). The frontend success page can call this with the session_id.
router.get('/create-order-from-session', createOrderFromSession);

export default router;
