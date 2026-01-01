import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import ProductCard from "./Card";
import Search from "./Search";
import Hero from "./Hero";
import type { IProduct, ApiResponse } from "../types";
import Grid from "@mui/material/Grid";

const Home: React.FC = () => {
  const [productsByArrival, setProductsByArrival] = useState<IProduct[]>([]);
  const [productsBySell, setProductsBySell] = useState<IProduct[]>([]);
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

      const sellRes: ApiResponse<{ data: IProduct[] }> =
        await getProducts("sold");

      if (sellRes.error) {
        setError(sellRes.error);
      } else {
        setProductsBySell(sellRes.data?.data ?? []);
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
        <div>
          {error}
        </div>
      )}

      {loading && (
        <div>
          Loading products...
        </div>
      )}

      <h2 className="text-center">New Arrivals</h2>
      <div className="row">
        {productsByArrival.length === 0 && !loading && !error && (
          <p className="text-center text-muted w-100">
            No new arrivals yet.
          </p>
        )}
        <Grid container spacing={2}>
          {productsByArrival.map((product) => (
            <Grid size={4} key={product._id} className="mb-3">
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </div>

      <h2 className="text-center">Best Sellers</h2>
      <div className="row">
        {productsBySell.length === 0 && !loading && !error && (
          <p className="text-center text-muted w-100">
            No best sellers yet.
          </p>
        )}
        <Grid container spacing={2}>
          {productsBySell.map((product) => (
            <Grid size={4} key={product._id} className="mb-3">
              <ProductCard product={{ ...product, count: 1 }} />
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
};

export default Home;