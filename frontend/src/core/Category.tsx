import type { IProduct } from "../types";
import { Box } from "@mui/material";
import Layout from "./Layout";
import Masonry from "@mui/lab/Masonry";
import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCategory } from "../admin/apiAdmin";
import type { CategoryData } from "../types";
import { categoryColors, categoryTextColors, secondaryTextColors } from "../constants/categoryColors";

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

  /*
Body copy 16–18px.
Lots of white space.
*/
 

  const bgColor = categoryColors[category.name] || "#FFFFFF";
  const textColor = categoryTextColors[category.name] || "#222020"
  const secondaryColor = secondaryTextColors[category.name] || "#333333"

  if (!products.length) {
    return (
      <Layout title="" description="" backgroundColor={bgColor}
        textColor={textColor}>
        <Box p={4} sx={{ display: "flex", justifyContent: "center", minHeight: "100vh", fontSize: "18px", backgroundColor: bgColor, color: textColor, fontFamily: "Inter, sans-serif" }}>
          New works are currently in progress.
        </Box>
      </Layout>
    );
  }

  return (
    <Box sx={{ backgroundColor: bgColor, color: textColor, fontFamily: "Inter, sans-serif", padding: "2rem" }}>
      <Layout title="" description="" backgroundColor={bgColor}
        textColor={textColor}>
        <h1 style={{ textAlign: "center", fontFamily: "Instrument Serif, serif", fontSize: "43px" }}>{category.name}</h1>
        <Masonry
          columns={{
            xs: 1,
            sm: 1,
            md: 2,
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