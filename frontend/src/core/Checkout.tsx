import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { clearCart } from "../redux/slices/cartSlice";
import { isAuthenticated } from "../auth";
import { getBraintreeClientToken, processPayment, createOrder } from "./apiCore";
import { Box, Button, TextField } from "@mui/material";
import braintree from "braintree-web-drop-in";
import Loader from "./Loader";
import AddressForm from "./AddressForm";
import type { CheckoutState } from "../types";
import { MuiTelInput } from 'mui-tel-input'

const Checkout: React.FC = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.cart.items);

  const [data, setData] = useState<CheckoutState>({
    loading: false,
    success: false,
    clientToken: null as string | null,
    error: "",
    address: { number: "", street: "", city: "", postcode: "", country: "", full: "" },
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const dropinContainer = useRef<HTMLDivElement | null>(null);
  const dropInInstance = useRef<any>(null);
  const dropInMounted = useRef(false);

  const auth = isAuthenticated();
  const userId = auth?.user?._id || null;
  const token = auth?.token || null;

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await getBraintreeClientToken(token);
        if (res.error) {
          setData(prev => ({
            ...prev,
            error: res.error || ""
          }));
        } else {
          setData(prev => ({
            ...prev,
            clientToken: res.clientToken || null,
            error: ""
          }));
        }
      } catch {
        setData(prev => ({
          ...prev,
          error: "Failed to load payment"
        }));
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (!data.clientToken ||
      !dropinContainer.current ||
      dropInMounted.current) return;

    dropInMounted.current = true;

    braintree.create({
      authorization: data.clientToken,
      container: dropinContainer.current,
      card: { cardholderName: true }
    },

      (err, instance) => {
        if (err) {
          setData(prev => ({
            ...prev,
            error: "Failed to load payment UI"
          }));

          return;
        }
        dropInInstance.current = instance;
      });
  }, [data.clientToken]);

  const getTotal = () => products.reduce((sum, p) => sum + (p.count ?? 1) * p.price, 0);

  const payOrder = async () => {
    if (!dropInInstance.current) return;
    setData(prev => ({ ...prev, loading: true }));

    try {
      const { nonce } = await dropInInstance.current.requestPaymentMethod();
      const paymentResponse = await processPayment({ paymentMethodNonce: nonce, amount: getTotal() }, token);
      if (!paymentResponse.data?.transaction) throw new Error("Payment failed");

      const transaction = paymentResponse.data.transaction;

      await createOrder({
        userId,
        token,
        orderData: {
          products,
          transaction_id: transaction.id,
          amount: Number(transaction.amount),
          address: data.address.full,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email,
          status: "Not processed",
          user: userId || null
        }
      });

      dispatch(clearCart());
      setData(prev => ({ ...prev, success: true }));
    } catch (err: any) {
      setData(prev => ({ ...prev, error: err.message }));
    } finally {
      setData(prev => ({
        ...prev,
        loading: false
      }))
    }
  };


  return (
    <Box>
      <h2>Total: €{getTotal()}</h2>
      <Loader loading={data.loading} />
      {data.success && <Box sx={{ color: "green" }}>Thanks! Your payment was successful!</Box>}
      {data.error && <Box sx={{ color: "red" }}>{data.error}</Box>}
      <TextField
        label="Email"
        value={data.email}
        onChange={(e) =>
          setData(prev => ({ ...prev, email: e.target.value }))
        }
        fullWidth
        required
        sx={{ mb: 1 }}
      />

      <TextField
        label="First name"
        value={data.firstName}
        onChange={(e) =>
          setData(prev => ({ ...prev, firstName: e.target.value }))
        }
        sx={{ mb: 1, width: "48%" }}
        required
      />

      <TextField
        label="Last name"
        value={data.lastName}
        onChange={(e) =>
          setData(prev => ({ ...prev, lastName: e.target.value }))
        }
        required
        sx={{ mb: 1, width: "48%" }}
      />

      <AddressForm value={data.address} onChange={(addr) => setData(prev => ({ ...prev, address: addr }))} />
      <MuiTelInput
        label="Phone number"
        value={data.phone}
        onChange={(value) =>
          setData(prev => ({ ...prev, phone: value }))
        }
        defaultCountry="FR"
        fullWidth
      />

      <Box ref={dropinContainer} sx={{ minHeight: 200, border: "1px solid #ddd", p: 2, borderRadius: 2, mb: 2 }} />
      <Button variant="contained" onClick={payOrder} disabled={
        !dropInInstance.current ||
        data.loading
      }>
        Pay
      </Button>
    </Box>
  );
};

export default Checkout;