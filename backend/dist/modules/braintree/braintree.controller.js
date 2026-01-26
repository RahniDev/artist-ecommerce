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
export const brainTreeToken = async (req, res) => {
    try {
        const response = await gateway.clientToken.generate({});
        res.json({ clientToken: response.clientToken });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
export const processPayment = async (req, res) => {
    const { paymentMethodNonce, amount } = req.body;
    try {
        const result = await gateway.transaction.sale({
            amount: amount,
            paymentMethodNonce: paymentMethodNonce,
            options: { submitForSettlement: true },
        });
        // result has `success` and `transaction`
        if (!result.success) {
            return res.status(400).json({
                error: result.message || "Transaction failed",
            });
        }
        res.json({
            transaction: result.transaction,
        });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
