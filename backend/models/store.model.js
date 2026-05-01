import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        logo_image: { type: String, required: true }
        // owner: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "User",
        //     required: false   // make required if you DO want only owners to create stores
        // }
    },
    { timestamps: true }
);


const Store = mongoose.model('Store', storeSchema);

export default Store;