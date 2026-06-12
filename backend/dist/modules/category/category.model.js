import mongoose, { Schema } from 'mongoose';
const CategorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true,
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        default: null,
    },
}, { timestamps: true });
export const Category = mongoose.model('Category', CategorySchema);
