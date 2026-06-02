import mongoose, { Schema, Types, Document } from "mongoose";

export interface IProduct {
  name: {
    en: string;
    de: string;
    es: string;
    it: string;
    fr: string;
  };
  description: {
    en: string;
    de: string;
    es: string;
    it: string;
    fr: string;
  };
  price: number;
  category: Types.ObjectId;
  subcategory: Types.ObjectId | null;
  quantity: number;
  sold: number;
  photos: {
    key: string;
    url: string;
    contentType: string;
  }[];
  shipping: boolean;
  weight: number;
  width: number;
  height: number;
  length: number;
}

export interface IProductDocument extends IProduct, Document { }

const productSchema = new Schema<IProductDocument>({
  name: {
    en: { type: String, required: true, trim: true },
    de: { type: String, default: '' },
    es: { type: String, default: '' },
    it: { type: String, default: '' },
    fr: { type: String, default: '' }
  },
  description: {
    en: { type: String, required: true },
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
  photos: [{
    key: { type: String, required: true },
    url: { type: String, required: true },
    contentType: String
  }],
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