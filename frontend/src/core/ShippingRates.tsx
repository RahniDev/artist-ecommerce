import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
  Alert,
} from "@mui/material";
import type { IRate, ShippingRatesProps } from "../types";

const ShippingRates: React.FC<ShippingRatesProps> = ({
  cartItems,
  address,
  onSelectRate,
}) => {
  const [rates, setRates] = useState<IRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRateId, setSelectedRateId] = useState<string>("");

  useEffect(() => {
    const fetchRates = async () => {
      if (!cartItems.length || !address) return;

      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/shipping/rates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartItems, toAddress: address }),
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          setError(data.error || "Failed to fetch shipping rates");
          setRates([]);
        } else {
          setRates(data.rates || []);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch shipping rates");
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [cartItems, address]);

  const handleSelect = (rateId: string) => {
    setSelectedRateId(rateId);
    const rate = rates.find((r) => r.id === rateId);
    if (rate) onSelectRate(rate);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!rates.length)
    return <Typography>No shipping options available</Typography>;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Shipping Method
      </Typography>

      <RadioGroup
        value={selectedRateId}
        onChange={(e) => handleSelect(e.target.value)}
      >
        {rates.map((rate) => (
          <FormControlLabel
            key={rate.id}
            value={rate.id}
            control={<Radio />}
            label={
              <>
                {rate.carrier} – {rate.service} – {rate.currency}{" "}
                {rate.rate}
                {rate.deliveryEstimate &&
                  ` (Est. ${rate.deliveryEstimate})`}
              </>
            }
          />
        ))}
      </RadioGroup>
    </Box>
  );
};

export default ShippingRates;