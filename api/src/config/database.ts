import mongoose from 'mongoose';
import { MONGO_URI } from 'config';
const connectDB = async () => {
return new Promise<void>((resolve, reject) => {
    mongoose.connect(MONGO_URI as string)
    .then(() => {
        console.log('MongoDB connected');
        resolve();
    })
    .catch((error) => {
        console.warn('MongoDB connection error:', error);
        reject(error);
    });
});
};

export default connectDB;
