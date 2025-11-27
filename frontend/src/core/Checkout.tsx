import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";

import {
    getBraintreeClientToken,
    processPayment,
    createOrder,
} from "./apiCore";
import { emptyCart } from "./cartHelpers";
import { isAuthenticated } from "../auth";
import type { ICartItem, IOrder, BraintreeTransaction } from "../types";

interface CheckoutProps {
    products: ICartItem[];
    setRun?: React.Dispatch<React.SetStateAction<boolean>>;
    run?: boolean;
}

interface CheckoutData {
    loading: boolean;
    success: boolean;
    clientToken: string | null;
    error: string;
    instance: any;
    address: string;
}

const Checkout: React.FC<CheckoutProps> = ({
    products,
    setRun = () => { },
    run = false,
}) => {
    const [data, setData] = useState<CheckoutData>({
        loading: false,
        success: false,
        clientToken: null,
        error: "",
        instance: null,
        address: "",
    });

    const auth = isAuthenticated();
    const userId = auth?.user._id;
    const token = auth?.token;

    const getToken = async () => {
        const data = await getBraintreeClientToken(userId!, token!);

        if ('error' in data) {
            setData(prev => ({ ...prev, error: data.error }));
        } else {
            setData(prev => ({ ...prev, clientToken: data.clientToken }));
        }
    };

    useEffect(() => {
        if (userId && token) getToken();
    }, [userId, token]);

    const getTotal = (): number =>
        products.reduce((sum, p) => sum + (p.count ?? 1) * p.price, 0);

    const handleAddress = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setData({ ...data, address: e.target.value });
    };

    const buy = async () => {
        if (!data.instance) return;
        setData({ ...data, loading: true });

        try {
            const { nonce } = await data.instance.requestPaymentMethod();
            const paymentData = { paymentMethodNonce: nonce, amount: getTotal() };

            const paymentResult: BraintreeTransaction = await processPayment(
                userId!,
                token!,
                paymentData
            );

            let orderData: IOrder | null = null;

            if ('transaction' in paymentResult) {
                const amount = Number(paymentResult.transaction.amount);
                if (isNaN(amount)) throw new Error("Invalid transaction amount");

                orderData = {
                    products,
                    transaction_id: paymentResult.transaction.id,
                    amount,
                    address: data.address,
                    status: "Received",
                    user: userId!,
                };

            }

            if (orderData) {
                await createOrder(userId!, token!, orderData);
            }

            emptyCart(() => setRun(!run));

            setData({ ...data, success: true, loading: false });
        } catch (err: any) {
            setData({ ...data, error: err.message, loading: false });
        }
    };



    const showDropIn = () =>
        data.clientToken !== null && products.length > 0 ? (
            <div onBlur={() => setData({ ...data, error: "" })}>
                <div className="form-group mb-3">
                    <label className="text-muted">Delivery Address:</label>
                    <textarea
                        className="form-control"
                        onChange={handleAddress}
                        value={data.address}
                        placeholder="Type your delivery address here..."
                    />
                </div>

                <DropIn
                    options={{
                        authorization: data.clientToken!,
                        paypal: { flow: "vault" },
                    }}
                    onInstance={(instance: any) => (data.instance = instance)}
                />

                <button onClick={buy} className="btn btn-success btn-block">
                    Pay
                </button>
            </div>
        ) : null;

    return (
        <div>
            <h2>Total: ${getTotal()}</h2>
            {data.loading && <h2 className="text-danger">Loading...</h2>}
            {data.success && (
                <div className="alert alert-info">Thanks! Your payment was successful!</div>
            )}
            {data.error && <div className="alert alert-danger">{data.error}</div>}
            {auth ? showDropIn() : (
                <Link to="/signin">
                    <button className="btn btn-primary">Sign in to checkout</button>
                </Link>
            )}
        </div>
    );
};

export default Checkout;
