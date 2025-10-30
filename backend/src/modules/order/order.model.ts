import mongoose, { Schema, Types } from 'mongoose'

interface IOrder {
    products: Schema.Types.Mixed[];
    transaction_id: string;
    amount: number;
    address: string;
    status: string;
    updated: Date;
    user: Types.ObjectId;
}

interface ICartItem {
    product: Schema.Types.ObjectId;
    name: string;
    price: number;
    count: number;
}

const CartItemSchema = new Schema<ICartItem>(
    {
        product: { type: Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        count: Number
    },
    { timestamps: true }
);

const CartItem = mongoose.model("CartItem", CartItemSchema);

const OrderSchema = new Schema<IOrder>({
    products: [CartItemSchema],
    transaction_id: {},
    amount: { type: Number },
    address: String,
    status: {
        type: String,
        default: "Not processed",
        enum: ["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"] // enum means string objects
    },
    updated: Date,
    user: { type: Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);

module.exports = { Order, CartItem }