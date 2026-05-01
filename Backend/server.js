import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import productRoutes from './routes/product.route.js';
import authRoutes from './routes/auth.route.js';
import cartRoutes from './routes/cart.route.js';
import wishlistRoutes from './routes/wishlist.route.js';
import storeRoutes from './routes/store.route.js';
import paymentRoutes from './routes/payment.route.js';
import { connectDB } from './libs/db.js';
import couponRoutes from './routes/coupon.route.js';
import analyticsRoutes from './routes/analytics.route.js';

import path from 'path';
import { fileURLToPath } from 'url';
import e from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Capture raw request body for Stripe webhook signature verification while
// still parsing JSON for other routes. The `verify` option stores the raw
// buffer on `req.rawBody`.

app.use(
    express.json({
        limit: '10mb',
        verify: (req, _res, buf) => {
            req.rawBody = buf;
        }
    })
);

app.use(express.urlencoded({ extended: true }));
// enable CORS (use CLIENT_URL in .env when available)
// Flexible CORS: support one or more allowed frontend origins via
// FRONTEND_URLS (comma-separated) or a single FRONTEND_URL env var.
// If FRONTEND_URLS is not set, fall back to localhost dev URL.
const rawFrontend =
    process.env.FRONTEND_URLS ||
    process.env.FRONTEND_URL ||
    'http://localhost:5173';
const allowedOrigins = rawFrontend
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

if (process.env.NODE_ENV === 'development') {
    app.use(
        cors({
            origin: allowedOrigins,
            credentials: true,
        })
    );
} else {
    app.use(
        cors({
            origin: (origin, callback) => {
                // allow requests with no origin (e.g., server-to-server or same-origin)
                if (!origin) return callback(null, true);
                if (allowedOrigins.includes(origin))
                    return callback(null, true);
                // For easier debugging in staging, allow requests from the request origin
                // when FRONTEND_URLS contains '*'
                if (allowedOrigins.includes('*')) return callback(null, true);
                return callback(
                    new Error(`CORS policy: origin ${origin} not allowed`)
                );
            },
            credentials: true
        })
    );
}

app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/analytics', analyticsRoutes);

if (process.env.NODE_ENV === 'development') {
    // Serve frontend (SPA) build and add safe catch-all for client routes
    const __filename = fileURLToPath(import.meta.url);
    // project root (one level up from backend)
    const __dirname = path.dirname(path.dirname(__filename));
    const buildPath = path.join(__dirname, 'frontend', 'dist');

    console.log('Serving frontend from ', buildPath);
    app.use(express.static(buildPath));

    app.use((req, res, next) => {
        // Only handle non-API GET requests with SPA index.html
        if (req.method !== 'GET') return next();
        if (req.path.startsWith('/api')) return next();
        res.sendFile(path.join(buildPath, 'index.html'));
    });

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

connectDB();

export default app;
