import { NextFunction, Request, Response } from "express";
import { Order, IOrder } from './order.model.js';
import { errorHandler, MongoError } from '../../helpers/errorHandler.js';
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

interface CustomRequest extends Request {
    profile?: any;
    order?: IOrder;
}

export const orderById = async (req: CustomRequest, res: Response, next: NextFunction, id: string) => {
    try {
        const order = await Order.findById(id)
            .populate("products.product", "name price");

        if (!order) {
            return res.status(404).json({ error: errorHandler(new Error('Order not found')) });
        }

        req.order = order;
        next();
    } catch (err) {
        return res.status(400).json({ error: errorHandler(err as MongoError) });
    }
};

export const create = async (req: CustomRequest, res: Response) => {
    try {
        const profile = req.profile;
        req.body.order.user = profile._id;
        const order = new Order(req.body.order);
        const savedOrder = await order.save();

        await Promise.allSettled([
            transporter.sendMail({
                to: process.env.GMAIL_USER,
                from: process.env.GMAIL_USER,
                subject: 'New order received',
                html: `
                    <p>Customer: ${profile?.name || 'Unknown'}</p>
                    <p>Total products: ${order.products.length}</p>
                    <p>Total cost: £${order.amount}</p>
                `
            }),
            transporter.sendMail({
                to: profile?.email,
                from: process.env.GMAIL_USER,
                subject: 'Your order is being processed',
                html: `
                    <p>Hi ${profile?.name}, thank you for your order!</p>
                    <p>We are processing your order and will send you a tracking number once it's shipped.</p>
                    <ul>
                    <li><strong>Order #${order._id}</strong></li>
                    <li>Total products: ${order.products.length}</li>
                    <li>Order total: €${order.amount}</li>
                    </ul>
                    <h2>Paintings purchased:</h2>
                    ${order.products.map((p) => {
                    const prod: any = p.product || {};
                    return `
                            <div style="margin-bottom:12px; display: flex; justify-content: space-between;">
                                <strong style="margin-right: 10px"> ${prod.name ?? p.name}</strong>
                                <strong> €${prod.price ?? p.price}</strong>
                            </div>
                        `;
                }).join('')}
                `
            })
        ]);

        return res.json(savedOrder);
    } catch (err) {
        return res.status(400).json({ error: errorHandler(err as MongoError) });
    }
};

export const listOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find()
            .populate("user", "_id name address")
            .sort("-createdAt")
            .lean();

        return res.json(orders);
    } catch (err) {
        return res.status(400).json({ error: errorHandler(err as MongoError) });
    }
};

export const getStatusValues = (req: Request, res: Response) => {
    const enumValues = Order.schema.path("status")?.options?.enum ?? [];
    return res.json(enumValues);
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const updated = await Order.findByIdAndUpdate(
            req.body.orderId,
            { $set: { status: req.body.status } },
            { new: true }
        );

        return res.json(updated);
    } catch (err) {
        return res.status(400).json({ error: errorHandler(err as MongoError) });
    }
};