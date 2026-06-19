import mongoose from "mongoose";

let cachedConnection = null;
let cachedPromise = null;

export const connectDB = async () => {
    if (cachedConnection) {
        return cachedConnection;
    }

    // 1 = connected
    if (mongoose.connection.readyState === 1) {
        cachedConnection = mongoose.connection;
        return cachedConnection;
    }

    if (!cachedPromise) {
        const opts = {
            bufferCommands: false,
        };
        cachedPromise = mongoose.connect(process.env.MONGO_URI, opts)
            .then((m) => {
                console.log(`MongoDB connected: ${m.connection.host}`);
                cachedConnection = m.connection;
                return cachedConnection;
            })
            .catch((error) => {
                console.error("Error connecting to MONGODB: ", error.message);
                cachedPromise = null;
                throw error;
            });
    }
    return cachedPromise;
};