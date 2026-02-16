import { NextFunction, Request, Response } from "express";
import { Order, IOrder } from './order.model.js';
import { errorHandler, MongoError } from '../../helpers/errorHandler.js';
import sgMail from '@sendgrid/mail'

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

        const adminEmail = {
            to: 'rahnidemeis@gmail.com',
            from: 'rahnidemeis@gmail.com',
            subject: 'New order received',
            html: `
                <p>Customer: ${profile?.name || 'Unknown'}</p>
                <p>Total products: ${order.products.length}</p>
                <p>Total cost: £${order.amount}</p>
            `
        };

        const customerEmail = {
            to: profile?.email,
            from: 'rahnidemeis@gmail.com',
            subject: 'Your order is being processed',
            html: `
                <h1>Hi ${profile?.name}, thank you for your order!</h1>
                <p>Total products: ${order.products.length}</p>
                <p>Order total: £${order.amount}</p>
                <p>Status: ${order.status}</p>

                <h2>Order Details:</h2>

                ${order.products.map((p) => {
                    const prod: any = p.product || {};
                    return `
                        <div style="margin-bottom:12px;">
                            <strong>Product:</strong> ${prod.name ?? p.name}<br>
                            <strong>Price:</strong> £${prod.price ?? p.price}<br>
                            <strong>Quantity:</strong> ${p.count}
                        </div>
                    `;
                }).join('')}
            `
        };

        await Promise.allSettled([
            sgMail.send(adminEmail),
            sgMail.send(customerEmail)
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