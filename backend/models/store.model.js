import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        logo_image: { type: String, required: true },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        isFeatured: {
            type: Boolean,
            default: false
        },
        commissionRate: {
            type: Number,
            default: 10 // 10% default commission
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        }
    },
    { timestamps: true }
);


const Store = mongoose.model('Store', storeSchema);

export default Store;