import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import Search from "./Search";
import Hero from "./Hero";
import type { IProduct, ApiResponse } from "../types";
import ListProducts from './ListProducts'

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
       <ListProducts />
      </div>
    </Layout>
  );
};

export default Home;