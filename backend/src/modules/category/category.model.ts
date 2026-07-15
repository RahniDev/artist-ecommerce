import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  parent: Types.ObjectId | null;
  level: number;
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
            ref: "Category",
            default: null,
        },
        level: {
            type: Number,
            required: true,
            enum: [1, 2, 3],
            default: 1,
        },
  },
  { timestamps: true }
);

export const Category: Model<ICategory> = mongoose.model<ICategory>('Category', CategorySchema)