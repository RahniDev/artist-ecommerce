import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import Search from "./Search";
import Hero from "./Hero";
import type { IProduct, ApiResponse } from "../types";
import ListProducts from './ListProducts'
import { Box, CircularProgress, Alert } from "@mui/material";

const Home: React.FC = () => {
  const [productsByArrival, setProductsByArrival] = useState<IProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
    <Layout
      title=""
      description="">
      <Hero />
      <Search />

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <h2>New Arrivals</h2>
      <div>
        {productsByArrival.length === 0 && !loading && !error && (
          <p>
            No new arrivals yet.
          </p>
        )}
        <ListProducts
          products={productsByArrival}
        />

      </div>
    </Layout>
  );
};

export default Home;