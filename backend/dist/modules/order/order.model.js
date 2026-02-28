import mongoose, { Schema } from 'mongoose';
const CartItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    name: String,
    price: Number,
    count: Number,
    weight: Number,
    width: Number,
    height: Number,
    length: Number
}, { timestamps: true });
const OrderSchema = new Schema({
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
export const Order = mongoose.model('Order', OrderSchema);
export const CartItem = mongoose.model('CartItem', CartItemSchema);
