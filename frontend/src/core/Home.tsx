import React, { useState, useEffect } from "react";
import { getProducts } from "./apiCore";
import type { IProduct, ApiResponse } from "../types";
import ListProducts from './ListProducts'
import { Box, Typography, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import Loader from "./Loader";
import Search from "./Search";
import CollectionSlider from "./CollectionSlider";
import Layout from "./Layout";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const Home: React.FC = () => {
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
  const [productsByArrival, setProductsByArrival] = useState<IProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const { t } = useTranslation();

  // const priceRanges: Record<number, [number, number]> = {
  //   0: [0, Infinity],
  //   1: [0, 500],
  //   2: [500, 1000],
  //   3: [1000, 2000],
  //   4: [2000, Infinity],
  // };
  // const prices = [
  //   { _id: 0, name: "Any price", array: [0, Infinity] },
  //   { _id: 1, name: "€0 - €500", array: [0, 500] },
  //   { _id: 2, name: "€500 - €1000", array: [500, 1000] },
  //   { _id: 3, name: "€1000 - €2000", array: [1000, 2000] },
  //   { _id: 4, name: "€2000+", array: [2000, Infinity] },
  // ];

  // const filteredProducts = productsByArrival.filter(p => {
  //   const [min, max] = priceRanges[selectedPrice] ?? [0, Infinity];
  //   return p.price >= min && p.price <= max;
  // });

  // const handleFilters = (value: number) => {
  //   setSelectedPrice(value);
  // };

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
  }, [currentLanguage]);

  return (
    <Layout title="" description="">
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Box>
          <Search />
        </Box>
      </Box>

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      <Loader loading={loading} />
      {/* <FeaturedPainting /> */}

      {/* No new arrivals */}
      <Typography sx={{ pb: 4 }} variant="h2" component="h2" textAlign="center">
        {t("latest_originals")}
      </Typography>

      {productsByArrival.length === 0 && !loading && !error && (
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {t("no_new_arrivals")}
        </Typography>
      )}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        {/* New arrivals */}
        {productsByArrival.length > 0 && !loading && !error && (
          <ListProducts products={productsByArrival} />
        )}
      </Box>
      <CollectionSlider categoryId="69a6d38a38bf6fdd8d8b84e9" />

    </Layout>
  );
};

export default Home;