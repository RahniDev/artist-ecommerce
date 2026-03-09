import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { IProduct } from "../types";
import { API } from "../config";
import { Grid, Typography, Box, Alert, CircularProgress } from "@mui/material";
import Layout from "./Layout";
import ShowImage from "./ShowImage";
import Masonry from "@mui/lab/Masonry";
import { useLocalizedDescription } from "../hooks/useLocalizedDescription";

// Separate component for each product
const ProductItem = ({ product }: { product: IProduct }) => {
  try {
    const { description: localizedDescription } = useLocalizedDescription(product);
    
    return (
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <ShowImage item={product} url='product' width="200px" />
        <Typography variant="h3" fontSize="24px">
          {product.name}
        </Typography>
        <Typography variant="body1" color='grey.600'>
          {localizedDescription}
        </Typography>
        <Typography variant="body1">€{product.price}</Typography>
      </Grid>
    );
  } catch (error) {
    console.error('Error in ProductItem:', error);
    return (
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <Typography color="error">Error loading product</Typography>
      </Grid>
    );
  }
};

export const SubcategoryProducts = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      setError("No category ID provided");
      return;
    }

    const fetchProducts = async () => {
      try {
        console.log('Fetching from:', `${API}/products/subcategory/${categoryId}`);
        
        const response = await fetch(`${API}/products/subcategory/${categoryId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
        } else {
          setProducts(data.data || []);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  if (loading) {
    return (
      <Layout title="" description="">
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="" description="">
        <Box p={4}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Layout>
    );
  }

  if (!products.length) {
    return (
      <Layout title="" description="">
        <Box p={4}>
          <Alert severity="info">No products found in this category</Alert>
        </Box>
      </Layout>
    );
  }

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
          <ProductItem key={product._id} product={product} />
        ))}
      </Masonry>
    </Layout>
  );
};