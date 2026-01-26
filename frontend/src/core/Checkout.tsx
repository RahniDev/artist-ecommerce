import React, { useEffect, useRef, useState } from "react";
import type { CheckoutProps, CheckoutData } from "../types";
import { isAuthenticated } from "../auth";
import { getBraintreeClientToken, processPayment, createOrder } from "./apiCore";
import { emptyCart } from "./cartHelpers";
import { Box, Button, Link } from "@mui/material";
import braintree from "braintree-web-drop-in";

const Checkout: React.FC<CheckoutProps> = ({ products, setRun = () => { }, run = false }) => {
  const [data, setData] = useState<CheckoutData>({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    address: "",
  });
  const [dropInInstance, setDropInInstance] = useState<any>(null);

  const dropinContainer = useRef<HTMLDivElement>(null);

  const auth = isAuthenticated();
  const userId = auth?.user._id;
  const token = auth?.token;

  const getToken = async () => {
    if (!userId || !token) return;

    const res = await getBraintreeClientToken(userId, token);
    if (res.error) {
      setData(prev => ({ ...prev, error: res.error ?? "" }));
    } else {
      setData(prev => ({ ...prev, clientToken: res.clientToken ?? null, error: "" }));
    }
  };

  useEffect(() => {
    getToken();
  }, [userId, token]);

  // Initialize DropIn manually
  useEffect(() => {
    if (!data.clientToken || !dropinContainer.current) return;

    let instance: any;
    braintree.create({
      authorization: data.clientToken,
      container: dropinContainer.current,
    }, (err: any, dropinInstance: any) => {
      if (err) {
        console.error("Braintree DropIn error:", err);
        setData(prev => ({ ...prev, error: "Failed to load payment UI" }));
        return;
      }
      instance = dropinInstance;
      setDropInInstance(instance);
    });

    return () => {
      // Cleanup DropIn on unmount
      if (instance) instance.teardown(() => console.log("Braintree DropIn torn down"));
    };
  }, [data.clientToken]);

  const getTotal = () => products.reduce((sum, p) => sum + (p.count ?? 1) * p.price, 0);

  const handleAddress = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(prev => ({ ...prev, address: e.target.value }));
  };

  const buy = async () => {
    if (!dropInInstance) return;

    setData(prev => ({ ...prev, loading: true }));
    try {
      const { nonce } = await dropInInstance.requestPaymentMethod();
      const paymentResponse = await processPayment(userId!, token!, {
        paymentMethodNonce: nonce,
        amount: getTotal(),
      });

      if (paymentResponse.error || !paymentResponse.data?.transaction) {
        throw new Error(paymentResponse.error || "Payment failed");
      }

      const transaction = paymentResponse.data.transaction;
      console.log("Transaction ID:", transaction.id);

      await createOrder(userId!, token!, {
        products,
        transaction_id: transaction.id,
        amount: Number(transaction.amount),
        address: data.address,
        status: "Received",
        user: userId!,
      });

      emptyCart(() => setRun(!run));
      setData(prev => ({ ...prev, success: true, loading: false }));
    } catch (err: any) {
      setData(prev => ({ ...prev, error: err.message, loading: false }));
    }
  };

  return (
    <Box>
      <h2>Total: €{getTotal()}</h2>
      {data.loading && <h2>Loading...</h2>}
      {data.success && <div>Thanks! Your payment was successful!</div>}
      {data.error && <div style={{ color: "red" }}>{data.error}</div>}

      {auth ? (
        <Box>
          <Box sx={{ mb: 2 }}>
            <label>Delivery Address:</label>
            <textarea
              value={data.address}
              onChange={handleAddress}
              placeholder="Type your delivery address here..."
              style={{ width: "100%" }}
            />
          </Box>

          <Box
            ref={dropinContainer}
            sx={{
              minHeight: 200,
              border: "1px solid #ddd",
              p: 2,
              borderRadius: 2,
              mb: 2,
            }}
          />

          <Button
            variant="contained"
            onClick={buy}
            disabled={!dropInInstance || data.loading}
          >
            Pay
          </Button>
        </Box>
      ) : (
        <Link href="/signin">Sign in to checkout</Link>
      )}
    </Box>
  );
};

export default Checkout;
