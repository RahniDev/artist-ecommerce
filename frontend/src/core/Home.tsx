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

      <CollectionSlider subcategoryId="69a6d38a38bf6fdd8d8b84e9" />

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
      {/* New arrivals */}
      {productsByArrival.length > 0 && !loading && !error && (
        <ListProducts products={productsByArrival} />
      )}
    </Layout>
  );
};

export default Home;