import mongoose from 'mongoose';
export const connectDB = async () => {
    await mongoose.connect(process.env.DATABASE);
    await console.log('DB connected');
};
