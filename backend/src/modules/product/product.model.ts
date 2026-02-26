import mongoose, { Schema, Types, Document } from "mongoose";

export interface IProduct {
  name: string;
  description: string;
  price: number;
  category: Types.ObjectId;
  quantity: number;
  sold: number;
  photo: {
    data: Buffer;
    contentType: string;
  };
  shipping: boolean;
  weight: number;
  width: number;
  height: number;
  length: number;
}

export interface IProductDocument extends IProduct, Document { }

const productSchema = new Schema<IProductDocument>({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  price: {
    type: Number,
    trim: true,
    required: true,
    maxlength: 32
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  quantity: {
    type: Number
  },
  sold: {
    type: Number,
    default: 0
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  shipping: {
    required: false,
    type: Boolean
  },
  weight: {
    type: Number, // grams
    required: true
  },
  // cm
  width: Number,
  height: Number,
  length: Number,
}, { timestamps: true });

export const Product = mongoose.model<IProductDocument>("Product", productSchema);