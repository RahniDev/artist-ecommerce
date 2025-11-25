import mongoose, { Schema, Types } from 'mongoose'

export interface ICategory {
  name: string; 
}

const CategorySchema = new Schema<ICategory>({
    name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32,
    unique: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);