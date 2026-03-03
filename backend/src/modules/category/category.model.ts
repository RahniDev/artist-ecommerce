import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  parent?: Types.ObjectId | null;
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
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
  },
  { timestamps: true }
);

export const Category: Model<ICategory> = mongoose.model<ICategory>('Category', CategorySchema)