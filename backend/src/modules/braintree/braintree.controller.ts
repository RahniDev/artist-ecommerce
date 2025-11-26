import { Request, Response } from 'express';
import braintree from 'braintree';
import dotenv from 'dotenv';

dotenv.config();

// Connect to Braintree
const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID || '',
    publicKey: process.env.BRAINTREE_PUBLIC_KEY || '',
    privateKey: process.env.BRAINTREE_PRIVATE_KEY || ''
});

export const brainTreeToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await gateway.clientToken.generate({});
        res.json(response);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

export const processPayment = async (req: Request, res: Response): Promise<void> => {
    const { paymentMethodNonce, amount } = req.body;

    try {
        const result = await gateway.transaction.sale({
            amount: amount,
            paymentMethodNonce: paymentMethodNonce,
            options: {
                submitForSettlement: true
            }
        });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};
