import type { IProduct } from "../types";
import { Box } from "@mui/material";
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

  const categoryColors: Record<string, string> = {
    Untitled: "#D8D0C3",
    Reality: "#C9B89E",
    Memory: "#66727A",
    Vibration: "#365D61",
    Solitude: "#343B46",
    Thresholds: "#5B4752",
    Guidance: "#9B7A45",
    "Darker Depths": "#432F38",
    "The Unknown": "#172735",
    Dimensions: "#263E3A",
    Truth: "#777C70",
    Essence: "#B39A83",
    Space: "#202D3A",
    Form: "#D4D1CA",
  };


  const categoryTextColors: Record<string, string> = {
    "Darker Depths": "#F1E8DE",
    "Worlds & Dimensions": "#F1E8DE",
    "Vibration": "#e5eafb",
    "Essence": "#4b3c4b"
  }
  const secondaryTextColors: Record<string, string> = {
    "Darker Depths": "#BFB3A9",
    "Worlds & Dimensions": "#BFB3A9",
    "Vibration": "#e5eafb"
  }

  const bgColor = categoryColors[category.name] || "#FFFFFF";
  const textColor = categoryTextColors[category.name] || "#222020"
  const secondaryColor = secondaryTextColors[category.name] || "#333333"

  if (!products.length) {
    return (
      <Layout title="" description="" backgroundColor={bgColor}
        textColor={textColor}>
        <Box p={4} sx={{ display: "flex", justifyContent: "center", minHeight: "100vh", fontSize: "18px", backgroundColor: bgColor, color: textColor }}>
          New works are currently in progress.
        </Box>
      </Layout>
    );
  }

  return (
    <Box sx={{ backgroundColor: bgColor, color: textColor }}>
      <Layout title="" description="" backgroundColor={bgColor}
        textColor={textColor}>
        <h1 style={{ textAlign: "center" }}>{category.name}</h1>
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