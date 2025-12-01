import mongoose, { Schema } from 'mongoose';
const CategorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true,
    },
}, { timestamps: true });
export const Category = mongoose.model('Category', CategorySchema);
