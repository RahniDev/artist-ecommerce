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
import { MuiTelInput } from 'mui-tel-input';
import type { Address, CheckoutState, CartItem } from "../types";
import ShippingRates from "./ShippingRates";

const Checkout: React.FC = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.cart.items);
  const [selectedShipping, setSelectedShipping] = useState<any>(null);

  const [data, setData] = useState<CheckoutState>({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    address: { street1: "", street2: "", city: "", state: "", zip: "", country: "", full: "" },
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

  // Convert cart products to CartItem type required for shipping
  const cartItems: CartItem[] = products.map(p => ({
    _id: p._id,
    name: p.name,
    price: p.price,
    weight: p.weight ?? 500,
    length: p.length ?? 0,
    width: p.width ?? 0,
    height: p.height ?? 0,
    description: p.description ?? "",
    category: p.category ?? "",
    shipping: p.shipping ?? false,
    sold: p.sold ?? 0,
    count: p.count ?? 1,
    quantity: p.count ?? 1
  }));

  const address: Address | null = data?.address?.full
    ? {
      street1: data.address.street1,
      street2: data.address.street2,
      city: data.address.city,
      state: data.address.state,
      zip: data.address.zip,
      country: data.address.country,
      full: data.address.full,
    }
    : null;

  const getTotal = () => {
    const productTotal = products.reduce((sum, p) => sum + (p.count ?? 1) * p.price, 0);
    const shipping = Number(selectedShipping?.rate || 0);
    return productTotal + shipping;
  };

  // Load Braintree token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await getBraintreeClientToken(token);
        if (res.error) setData(prev => ({ ...prev, error: res.error || "" }));
        else setData(prev => ({ ...prev, clientToken: res.clientToken || null, error: "" }));
      } catch {
        setData(prev => ({ ...prev, error: "Failed to load payment" }));
      }
    };
    fetchToken();
  }, [token]);

  // Initialize Braintree Drop-in UI
  useEffect(() => {
    if (!data.clientToken || !dropinContainer.current || dropInMounted.current) return;
    dropInMounted.current = true;
    braintree.create(
      {
        authorization: data.clientToken,
        container: dropinContainer.current,
        card: { cardholderName: true },
      },
      (err, instance) => {
        if (err) return setData(prev => ({ ...prev, error: "Failed to load payment UI" }));
        dropInInstance.current = instance;
      }
    );
  }, [data.clientToken]);

  const payOrder = async () => {
    if (!dropInInstance.current || !selectedShipping || !address) return;
    setData(prev => ({ ...prev, loading: true }));

    try {
      // Payment
      const { nonce } = await dropInInstance.current.requestPaymentMethod();
      const paymentResponse = await processPayment({ paymentMethodNonce: nonce, amount: getTotal() }, token);
      if (!paymentResponse.data?.transaction) throw new Error("Payment failed");
      const transaction = paymentResponse.data.transaction;

      // Create order in backend
      const orderData = {
        products,
        transaction_id: transaction.id,
        amount: Number(transaction.amount),
        address: data.address.full,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        status: "Not processed",
        user: userId || null,
      };
      await createOrder({ userId, token, orderData });

      // Buy shipping label
      await fetch("/api/shipping/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rate: selectedShipping,
          cartItems,
          toAddress: address,
        }),
      });

      dispatch(clearCart());
      setData(prev => ({ ...prev, success: true }));
    } catch (err: any) {
      setData(prev => ({ ...prev, error: err.message || "Payment/shipping failed" }));
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <Box>
      <h2>Total: €{getTotal()}</h2>
      <Loader loading={data.loading} />
      {data.success && <Box sx={{ color: "green" }}>Thanks! Your payment was successful!</Box>}
      {data.error && <Box sx={{ color: "red" }}>{data.error}</Box>}

      <TextField label="Email" value={data.email} onChange={e => setData(prev => ({ ...prev, email: e.target.value }))} fullWidth required sx={{ mb: 1 }} />
      <TextField label="First name" value={data.firstName} onChange={e => setData(prev => ({ ...prev, firstName: e.target.value }))} sx={{ mb: 1, width: "48%" }} required />
      <TextField label="Last name" value={data.lastName} onChange={e => setData(prev => ({ ...prev, lastName: e.target.value }))} sx={{ mb: 1, width: "48%" }} required />

      <AddressForm value={data.address} onChange={addr => setData(prev => ({ ...prev, address: addr }))} />
      <MuiTelInput label="Phone number" value={data.phone} onChange={value => setData(prev => ({ ...prev, phone: value }))} defaultCountry="FR" fullWidth />

      {address && (
        <ShippingRates
          cartItems={cartItems}
          address={address}
          onSelectRate={setSelectedShipping}
        />
      )}

      {selectedShipping && (
        <p>
          Selected: {selectedShipping.type === "STANDARD" ? "Postal" : "Express"} - {selectedShipping.carrier} - {selectedShipping.service} - {selectedShipping.currency} {selectedShipping.rate}
        </p>
      )}

      <Box ref={dropinContainer} sx={{ minHeight: 200, border: "1px solid #ddd", p: 2, borderRadius: 2, mb: 2 }} />
      <Button variant="contained" onClick={payOrder} disabled={!dropInInstance.current || data.loading || !selectedShipping}>
        Pay
      </Button>
    </Box>
  );
};

export default Checkout;