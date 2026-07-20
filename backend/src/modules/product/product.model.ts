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
  quantity: number;
  sold: number;
  photos: {
    key: string;
    contentType: string;
    sizes: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  }[];
  material: string;
  medium: string;
  weight: number;
  size: string;
  length: number;
  framing: string;
  additionalDetails: string;
  quality: string;
  colors: string[];
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
  photos: [{
    key: String,
    contentType: String,
    sizes: {
      xs: String,
      sm: String,
      md: String,
      lg: String,
      xl: String
    }
  }],
  weight: {
    type: Number, // grams
    required: true
  },
  material: {
    type: String,
    required: true,
    trim: true,
  },
  size: {
    type: String,
    required: true,
    trim: true,
  },
  medium: {
    type: String,
    required: true,
    trim: true,
  },
  length: Number,
  framing: {
    type: String,
    enum: ["Unframed", "Ready to hang"],
    default: "Unframed"
  },
  additionalDetails: String,
}, { timestamps: true });

export const Product = mongoose.model<IProductDocument>("Product", productSchema);