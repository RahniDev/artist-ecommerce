import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { IProduct } from "../types";
import { API } from "../config";
import { Grid, Typography, Box, Alert, CircularProgress, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import ShowImage from "./ShowImage";
import Masonry from "@mui/lab/Masonry";
import { useLocalizedDescription } from "../hooks/useLocalizedDescription";

const ProductItem = ({ product }: { product: IProduct }) => {
  try {
    const { description: localizedDescription } = useLocalizedDescription(product);

    return (
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <MuiLink component={Link} to={`/product/${product._id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <ShowImage item={product} url='product' width="200px" />
          <Typography variant="h3" fontSize="24px">
            {product.name}
          </Typography>
          <Typography variant="body1" color='grey.600'>
            {localizedDescription}
          </Typography>
          <Typography variant="body1">€{product.price}</Typography>
        </MuiLink>
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

export const SubcategoryProducts = ({ category }: any) => {
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
    console.log(category)

    const fetchProducts = async () => {
      try {
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

  const subcategoryColors: Record<string, string> = {
    Reality: "#E6E1D8",            // Limestone
  Solitude: "#D9D0C2",           // Sandalwood
  "Worlds_&_Dimensions": "#D7DFE6",// Monsoon Sky
  "Darker_Depths": "#353739",      // Blue Charcoal
  Memory: "#E4D5C6",             // Aged Paper
  Guidance: "#DCCAA5",           // Muted Saffron
  Vibration: "#D9D0E4",          // Dusty Amethyst
  Emotions: "#DCC5BF",           // Rose Clay
  Essence: "#E3E6DD",            // Sacred Ash
  Truth: "#D7DDD7",              // Temple Stone
  "The Unknown": "#C9D2D4",        // Himalayan Mist
  };

  const bgColor =
    category?.name
      ? subcategoryColors[category.name] || "#FFFFFF"
      : "#FFFFFF";
  return (
    <div style={{ backgroundColor: bgColor }}>
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
    </div>
  );
};