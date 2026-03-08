import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { IProduct } from "../types";
import { API } from "../config";
import { Grid, Typography } from "@mui/material";
import Layout from "./Layout";
import ShowImage from "./ShowImage";
import Masonry from "@mui/lab/Masonry";

export const SubcategoryProducts = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    fetch(`${API}/products/subcategory/${categoryId}`)
      .then(res => {
        return res.json();
      })
      .then(data => {
        if (data.error) setError(data.error);
        else setProducts(data.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!products.length) return <div>No products found</div>;

  return (
    <Layout title="" description="">
      <Masonry
        columns={{
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
        }}
        spacing={4}
      >
        {products.map(product => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product._id}>
            <ShowImage item={product} url='product' width="200px" />
            <Typography variant="h3" fontSize="24px">
              {product.name}
            </Typography>
            <Typography variant="body1" color='grey.600'>
              {product.description}
            </Typography>
            <Typography variant="body1">€{product.price}</Typography>
          </Grid>
        ))}
      </Masonry>
    </Layout>
  );
};