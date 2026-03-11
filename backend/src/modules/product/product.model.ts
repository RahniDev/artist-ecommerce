import mongoose, { Schema, Types, Document } from "mongoose";

export interface IProduct {
  name: string;
  description: {
    en: string;  // This should be string, NOT { type: String, required: true }
    de: string;  // This should be string
    es: string;  // This should be string
    it: string;  // This should be string
    fr: string;  // This should be string
  };
  price: number;
  category: Types.ObjectId;
  subcategory: Types.ObjectId | null;
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
    maxlength: 60
  },
  description: {
    en: { type: String, required: true },  // Schema definition - this is CORRECT here
    de: { type: String, default: '' },
    es: { type: String, default: '' },
    it: { type: String, default: '' },
    fr: { type: String, default: '' }
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
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
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