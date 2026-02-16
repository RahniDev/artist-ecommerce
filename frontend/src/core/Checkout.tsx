import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { clearCart } from "../redux/slices/cartSlice";
import { isAuthenticated } from "../auth";
import { getBraintreeClientToken, processPayment, createOrder } from "./apiCore";
import { Box, Button, Link } from "@mui/material";
import braintree from "braintree-web-drop-in";
import Loader from "./Loader";
import AddressForm from "./AddressForm";
import type { Address } from "../types";

const Checkout: React.FC = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.cart.items);

  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null as string | null,
    error: "",
    address: { street: "", city: "", postcode: "", country: "", full: "" } as Address,
  });

  const dropinContainer = useRef<HTMLDivElement | null>(null);
  const dropInInstance = useRef<any>(null);
  const dropInMounted = useRef(false);

  const auth = isAuthenticated();
  const userId = auth?.user._id;
  const token = auth?.token;

  const getToken = async () => {
    if (!userId || !token) return;
    const res = await getBraintreeClientToken(userId, token);
    if (res.error) setData(prev => ({ ...prev, error: res.error ?? "" }));
    else setData(prev => ({ ...prev, clientToken: res.clientToken ?? null, error: "" }));
  };

  useEffect(() => { getToken(); }, [userId, token]);

  useEffect(() => {
    if (!data.clientToken || !dropinContainer.current || dropInMounted.current) return;

    dropInMounted.current = true;
    dropinContainer.current.innerHTML = "";

    braintree.create(
      { authorization: data.clientToken, container: dropinContainer.current, card: { cardholderName: true } },
      (err: any, instance: any) => {
        if (err) {
          setData(prev => ({ ...prev, error: "Failed to load payment UI" }));
          dropInMounted.current = false;
          return;
        }
        dropInInstance.current = instance;
      }
    );

    return () => { dropInInstance.current?.teardown(); dropInInstance.current = null; dropInMounted.current = false; };
  }, [data.clientToken]);

  const getTotal = () => products.reduce((sum, p) => sum + (p.count ?? 1) * p.price, 0);

  const buy = async () => {
    if (!dropInInstance.current || !userId || !token) return;

    setData(prev => ({ ...prev, loading: true }));

    try {
      const { nonce } = await dropInInstance.current.requestPaymentMethod();
      const paymentResponse = await processPayment(userId, token, { paymentMethodNonce: nonce, amount: getTotal() });
      if (!paymentResponse.data?.transaction) throw new Error("Payment failed");

      const transaction = paymentResponse.data.transaction;

      await createOrder(userId, token, {
        products,
        transaction_id: transaction.id,
        amount: Number(transaction.amount),
        address: data.address.full,
        status: "Not processed",
        user: userId,
      });

      dispatch(clearCart());
      setData(prev => ({ ...prev, success: true, loading: false }));
    } catch (err: any) {
      setData(prev => ({ ...prev, error: err.message, loading: false }));
    }
  };

  if (!auth) return <Link href="/signin">Sign in to checkout</Link>;

  return (
    <Box>
      <h2>Total: €{getTotal()}</h2>
      <Loader loading={data.loading} />
      {data.success && <Box sx={{ color: "green" }}>Thanks! Your payment was successful!</Box>}
      {data.error && <Box sx={{ color: "red" }}>{data.error}</Box>}

      <AddressForm value={data.address} onChange={(addr) => setData(prev => ({ ...prev, address: addr }))} />

      <Box ref={dropinContainer} sx={{ minHeight: 200, border: "1px solid #ddd", p: 2, borderRadius: 2, mb: 2 }} />
      <Button variant="contained" onClick={buy} disabled={!dropInInstance.current || data.loading}>
        Pay
      </Button>
    </Box>
  );
};

export default Checkout;