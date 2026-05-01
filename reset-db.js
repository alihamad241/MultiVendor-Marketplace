import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const resetDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // This will drop the entire database, removing all collections and data.
        await mongoose.connection.db.dropDatabase();
        
        console.log('Database successfully dropped/restarted!');
        process.exit(0);
    } catch (error) {
        console.error('Error dropping database:', error);
        process.exit(1);
    }
};

resetDatabase();
