import type { IProduct } from "../types";
import { Box, Alert } from "@mui/material";
import Layout from "./Layout";
import Masonry from "@mui/lab/Masonry";
import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCategory } from "../admin/apiAdmin";
import type { CategoryData } from "../types";

const Category = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<CategoryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (categoryId) {
      getCategory(categoryId)
        .then(data => {
          if (data.error) setError(data.error);
          else setCategory(data as unknown as CategoryData);
        })
        .catch(() => setError("Failed to load category"))
        .finally(() => setLoading(false));
    }
  }, [categoryId]);

  if (error) return <div>{error}</div>;
  if (loading) return <div>Loading...</div>;
  if (!category) return null;
  const products = category.products || [];
  console.log("PRODUCT RENDER:", products);
  if (!products.length) {
    return (
      <Layout title="" description="">
        <Box p={4}>
          <Alert severity="info">
            No products found in this category
          </Alert>
        </Box>
      </Layout>
    );
  }

  const categoryColors: Record<string, string> = {
    Reality: "#E6E1D8",
    Solitude: "#D9D0C2",
    "Worlds & Dimensions": "#D7DFE6",
    "Darker Depths": "#353739",
    Memory: "#E4D5C6",
    Guidance: "#DCCAA5",
    Vibration: "#D9D0E4",
    Emotions: "#DCC5BF",
    Essence: "#E3E6DD",
    Truth: "#D7DDD7",
    "The Unknown": "#C9D2D4",
  };

  const bgColor = categoryColors[category.name] || "#FFFFFF";

  return (
    <Box sx={{ backgroundColor: bgColor }}>
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
          {products.map((product: IProduct) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </Masonry>
      </Layout>
    </Box>
  );
};

export default Category;