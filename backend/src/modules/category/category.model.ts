import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
}

const CategorySchema: Schema<ICategory> = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      unique: true,
    },
  },
  { timestamps: true }
);

export const Category: Model<ICategory> = mongoose.model<ICategory>('Category', CategorySchema);
