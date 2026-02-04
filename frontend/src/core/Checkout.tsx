import React, { useEffect, useRef, useState } from "react";
import type { CheckoutProps, CheckoutData } from "../types";
import { isAuthenticated } from "../auth";
import { getBraintreeClientToken, processPayment, createOrder } from "./apiCore";
import { emptyCart } from "./cartHelpers";
import { Box, Button, Link } from "@mui/material";
import braintree from "braintree-web-drop-in";
import { useTranslation } from "react-i18next";

const Checkout: React.FC<CheckoutProps> = ({ products, setRun = () => { }, run = false }) => {
  const [data, setData] = useState<CheckoutData>({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    address: "",
  });
  const dropinContainer = useRef<HTMLDivElement | null>(null);
  const dropInInstance = useRef<any>(null);
  const dropInMounted = useRef(false);

    const { t } = useTranslation();
  
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

  useEffect(() => {
    if (
      !data.clientToken ||
      !dropinContainer.current ||
      dropInMounted.current
    ) {
      return;
    }

    dropInMounted.current = true;
    dropinContainer.current.innerHTML = "";

    braintree.create(
      {
        authorization: data.clientToken,
        container: dropinContainer.current,
        card: {
          cardholderName: true,
        },
      },
      (err: any, instance: any) => {
        if (err) {
          console.error("Braintree DropIn error:", err);
          setData(prev => ({ ...prev, error: "Failed to load payment UI" }));
          dropInMounted.current = false;
          return;
        }

        dropInInstance.current = instance;
      }
    );

    return () => {
      if (dropInInstance.current) {
        dropInInstance.current.teardown();
        dropInInstance.current = null;
        dropInMounted.current = false;
      }
    };
  }, [data.clientToken]);


  const getTotal = () => products.reduce((sum, p) => sum + (p.count ?? 1) * p.price, 0);

  const handleAddress = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(prev => ({ ...prev, address: e.target.value }));
  };

  const buy = async () => {
    if (!dropInInstance.current) return;

    setData(prev => ({ ...prev, loading: true }));

    try {
      const { nonce } =
        await dropInInstance.current.requestPaymentMethod();

      const paymentResponse = await processPayment(userId!, token!, {
        paymentMethodNonce: nonce,
        amount: getTotal(),
      });

      if (!paymentResponse.data?.transaction) {
        throw new Error("Payment failed");
      }

      const transaction = paymentResponse.data.transaction;

      await createOrder(userId!, token!, {
        products,
        transaction_id: transaction.id,
        amount: Number(transaction.amount),
        address: data.address,
        status: "Not processed",
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
            <label>{t("delivery_address")}:</label>
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
            disabled={!dropInInstance.current || data.loading}
          >
            Pay
          </Button>


        </Box>
      ) : (
        <Link href="/signin">{t("Sign in to checkout")}</Link>
      )}
    </Box>
  );
};

export default Checkout;