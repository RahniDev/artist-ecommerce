import { Order } from './order.model.js';
import { errorHandler } from '../../helpers/errorHandler.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});
export const orderById = async (req, res, next, id) => {
    try {
        const order = await Order.findById(id)
            .populate("products.product", "name price");
        if (!order) {
            return res.status(404).json({ error: errorHandler(new Error('Order not found')) });
        }
        req.order = order;
        next();
    }
    catch (err) {
        return res.status(400).json({ error: errorHandler(err) });
    }
};
export const create = async (req, res) => {
    try {
        const profile = req.profile;
        const orderInput = req.body.order;
        const order = new Order({
            ...orderInput,
            user: profile?._id ?? null,
            email: profile?.email ?? orderInput.email,
        });
        const savedOrder = await order.save();
        await Promise.allSettled([
            transporter.sendMail({
                to: process.env.GMAIL_USER,
                from: process.env.GMAIL_USER,
                subject: "New order received",
                html: `
          <p>Customer: ${profile?.name || `${order.firstName} ${order.lastName}`}</p>
          <p>Email: ${order.email}</p>
          <p>Total products: ${order.products.length}</p>
          <p>Total cost: €${order.amount}</p>
        `
            }),
            transporter.sendMail({
                to: order.email,
                from: process.env.GMAIL_USER,
                subject: "Your order is being processed",
                html: `
          <p>Hi ${order.firstName || profile?.name || "there"}, thank you for your order!</p>
          <p>We are processing your order and will send you a tracking number once it's shipped.</p>
          <ul>
            <li><strong>Order #${order._id}</strong></li>
            <li>Total products: ${order.products.length}</li>
            <li>Order total: €${order.amount}</li>
          </ul>
        `
            })
        ]);
        return res.json(savedOrder);
    }
    catch (err) {
        return res.status(400).json({ error: errorHandler(err) });
    }
};
export const listOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "_id name address")
            .sort("-createdAt")
            .lean();
        return res.json(orders);
    }
    catch (err) {
        return res.status(400).json({ error: errorHandler(err) });
    }
};
export const getStatusValues = (req, res) => {
    const enumValues = Order.schema.path("status")?.options?.enum ?? [];
    return res.json(enumValues);
};
export const updateOrderStatus = async (req, res) => {
    try {
        const updated = await Order.findByIdAndUpdate(req.body.orderId, { $set: { status: req.body.status } }, { new: true }).populate("user", "name email");
        if (req.body.status === 'Shipped' && updated?.user) {
            const user = updated.user;
            await transporter.sendMail({
                to: user.email,
                from: process.env.GMAIL_USER,
                subject: 'Your order has been shipped',
                html: `
                    <p>Hi ${user.name || 'Unknown'}</p>
                    <p>Your order has been shipped and is on its way to you!</p>
                    <p>Tracking number: </p>
                `
            });
        }
        return res.json(updated);
    }
    catch (err) {
        return res.status(400).json({ error: errorHandler(err) });
    }
};
