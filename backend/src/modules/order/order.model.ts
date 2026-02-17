import mongoose, { Schema, Types } from 'mongoose';
import { IProduct } from '../product/product.model.js';

// This represents one product in an order
interface ICartItem {
  product: Types.ObjectId | IProduct;
  count: number;
  name?: string;
  price?: number;
}
const CartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  name: String,
  price: Number,
  count: Number
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
  user: { type: Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
export const CartItem = mongoose.model<ICartItem>('CartItem', CartItemSchema);