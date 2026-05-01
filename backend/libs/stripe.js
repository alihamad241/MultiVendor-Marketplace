import Stripe from "stripe";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';

dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

