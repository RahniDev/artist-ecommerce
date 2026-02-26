import mongoose, { Schema, Types } from 'mongoose';
import { IProduct } from '../product/product.model.js';

// This represents one product in an order
export interface ICartItem {
  quantity: any;
  product: Types.ObjectId | IProduct;
  count: number;
  name: string;
  price: number;
  weight: number,
  width: number,
  height: number,
  length: number
}
const CartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  name: String,
  price: Number,
  count: Number,
  weight: Number,
  width: Number,
  height: Number,
  length: Number
}, { timestamps: true });

export interface IOrder {
  products: ICartItem[];
  transaction_id: string;
  amount: number;
  address: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: string;
  updated: Date;
  user: Types.ObjectId;
  shipping: string;
  carrier: string,
  service: string,
  rate: number,
  currency: string
}

const OrderSchema = new Schema<IOrder>({
  products: [CartItemSchema],
  transaction_id: {},
  amount: { type: Number },
  address: String,
  firstName: String,
  lastName: String,
  phone: String,
  status: {
    type: String,
    default: "Not processed",
    enum: ["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"]
  },
  updated: Date,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  shipping: {
    carrier: String,
    service: String,
    rate: Number,
    currency: String

  },
}, { timestamps: true });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
export const CartItem = mongoose.model<ICartItem>('CartItem', CartItemSchema);