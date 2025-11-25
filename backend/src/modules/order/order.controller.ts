import { NextFunction, Request, Response } from "express";

import { Order, IOrder } from './order.model';
import {errorHandler} from '../../helpers/errorHandler';

import sgMail = require('@sendgrid/mail');
//sgMail.setApiKey('');

export const orderById = (req: Request, res: Response, next: NextFunction, id): void => {
    Order.findById(id)
        .populate('products.product', 'name price')
        .then((order: IOrder | null) => {
            if (!order) {
                return res.status(400).json({
                    error: errorHandler(new Error('Order not found'))
                });
            }
            (req as any).order = order;
            next();
        })
        .catch(err => {
            return res.status(400).json({
                error: errorHandler(err)
            });
        });
};

export const create = (req: Request, res: Response) => {
    console.log('CREATE ORDER: ', req.body);
    // req.profile is not part of the Express Request type by default — cast to any
    req.body.order.user = (req as any).profile;
    const order = new Order(req.body.order);
    order
        .save()
        .then((data: IOrder) => {
            // send email alert to admin
            // order.address
            const emailData = {
                to: 'rahnidemeis@gmail.com',
                from: 'rahni32@protonmail.com',
                subject: `A new order is received`,
                html: `
                <p>Customer name:</p>
                <p>Total products: ${order.products.length}</p>
                <p>Total cost: £${order.amount}</p>
                <p>Login to dashboard to view the order in detail.</p>
            `
            };
            sgMail
            .send(emailData)
            .then(sent => console.log('SENT >>>', sent))
            .catch(err => console.log('ERR >>>', err));

        // email to buyer
            const profile = (req as any).profile;
            const emailData2 = {
                to: (profile && profile.email) ? profile.email : (order.user as any).email,
                from: 'rahnidemeis@gmail.com',
                subject: `You order is in process`,
                html: `
                <h1>Hey ${profile ? profile.name : ''}, Thank you for shopping with us.</h1>
                <h2>Total products: ${order.products.length}</h2>
                <h2>Transaction ID: ${order.transaction_id}</h2>
                <h2>Order status: ${order.status}</h2>
                <h2>Product details:</h2>
                <hr />
                ${order.products
                    .map(p => {
                        return `<div>
                            <h3>Product Name: ${p.name}</h3>
                            <h3>Product Price: £${p.price}</h3>
                            <h3>Product Quantity: ${p.quantity}</h3>
                    </div>`;
                    })
                    .join('--------------------')}
                <h2>Total order cost: ${order.amount}<h2>
                <p>Thank your for shopping with us.</p>
            `
            };
        sgMail
            .send(emailData2)
            .then(sent => console.log('SENT 2 >>>', sent))
            .catch(err => console.log('ERR 2 >>>', err));

        res.json(data);
        })
        .catch(error => {
            return res.status(400).json({
                error: errorHandler(error)
            });
        });
};

export const listOrders = (req: Request, res: Response) => {
    Order.find()
        .populate('user', '_id name address')
        .sort('-created')
        .then(orders => {
            res.json(orders);
        })
        .catch(err => {
            return res.status(400).json({
                error: errorHandler(err)
            });
        });
};

export const getStatusValues = (req: Request, res: Response) => {
    const schemaPath: any = Order.schema.path('status');
    const enumValues = (schemaPath && (schemaPath.enumValues || (schemaPath.options && schemaPath.options.enum)))
        ? (schemaPath.enumValues || schemaPath.options.enum)
        : [];
    res.json(enumValues);
};

export const updateOrderStatus = (req: Request, res: Response) => {
    Order.findByIdAndUpdate({ _id: req.body.orderId }, { $set: { status: req.body.status } }, (err, order) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(order);
    });
};