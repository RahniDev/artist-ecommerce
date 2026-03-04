import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCategory } from "../admin/apiAdmin";
import type { CategoryData } from "../types";
import { Box, Typography, Grid, Link } from "@mui/material";

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
          console.log(data)
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

  return (
    <Box>
      <Typography variant="h1">{category.name}</Typography>
      {category.subcategories.length > 0 && (
        <Box>
          <Typography variant="h2">Collections</Typography>
          <Grid container spacing={2}>
            {category.subcategories.map(sub => (
              <Grid size={3} key={sub._id}>
                <Link href={`/category/${sub._id}`}
                 style={{ backgroundImage: `url(/api/product/photo/${sub.products[0]?._id})` }}
                  underline="hover">
                  <Typography variant="h3">{sub.name}</Typography>
                  <span>View series</span>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Category;