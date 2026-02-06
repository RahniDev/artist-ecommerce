import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import Search from "./Search";
import Hero from "./Hero";
import type { IProduct, ApiResponse } from "../types";
import ListProducts from './ListProducts'
import { Box, Container, Typography, Alert, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import Loader from "./Loader";

const Home: React.FC = () => {
  const [productsByArrival, setProductsByArrival] = useState<IProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();

  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const arrivalRes: ApiResponse<{ data: IProduct[] }> =
        await getProducts("createdAt");

      if (arrivalRes.error) {
        setError(arrivalRes.error);
      } else {
        setProductsByArrival(arrivalRes.data?.data ?? []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Layout title="" description="">
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Hero />
          <Search />
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          <Loader loading={loading} />

          {/* New Arrivals */}
          <Typography variant="h4" component="h2" textAlign="center">
            {t("new_arrivals")}
          </Typography>

          {productsByArrival.length === 0 && !loading && !error && (
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              {t("no_new_arrivals")}
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <ListProducts products={productsByArrival} />
          </Box>
        </Stack>
      </Container>
    </Layout>
  );
};

export default Home;