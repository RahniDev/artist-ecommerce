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
    Reality: "#DCD2C3",
    Solitude: "#E6EBF1",
    "Worlds & Dimensions": "#C8D0E0",
    "Darker Depths": "#5E5752",
    Memory: "#D8C3B2",
    Guidance: "#D7E0E4",
    Vibration: "#D9D0E4",
    Emotions: "#DCC5BF",
    Essence: "#EADDD7",
    Truth: "#E7E0D6",
    "The Unknown": "#B7BEC5",
  };

  const categoryFonts: Record<string, string> = {
    Reality: "Work Sans, sans-serif",
    Solitude: "Cormorant Garamond, serif",
    Memory: "Crimson Text",
    "Worlds & Dimensions": "Bodoni Moda, serif",
    "Darker Depths": "Cormorant Garamond, serif",
    Guidance: "Spectral, serif",
    Vibration: "Manrope, sans-serif",
    //  Emotions: ,
    Essence: "Crimson Text",
    Truth: "Cormorant Garamond, serif",
    "The Unknown": "Fraunces, serif",
  }


  const categoryTextColors: Record<string, string> = {
    "Darker Depths": "#F1E8DE"
  }
  const secondaryTextColors: Record<string, string> = {
    "Darker Depths": "#BFB3A9"
  }

  const bgColor = categoryColors[category.name] || "#FFFFFF";
  const fontFamily = categoryFonts[category.name] || "Inter, sans-serif";
  const textColor = categoryTextColors[category.name] || "#000000"
  const secondaryColor = secondaryTextColors[category.name] || "#333333"

  return (
    <Box sx={{ backgroundColor: bgColor, color: textColor }}>
      <Layout title="" description="">
        <h1 style={{ fontFamily: fontFamily, textAlign: "center" }}>{category.name}</h1>
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
              textColor={textColor}
              secondaryColor={secondaryColor}
            />
          ))}
        </Masonry>
      </Layout>
    </Box>
  );
};

export default Category;