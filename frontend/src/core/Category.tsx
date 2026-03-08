import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCategory } from "../admin/apiAdmin";
import type { CategoryData } from "../types";
import { Box, Typography, Grid, Link } from "@mui/material";
import { SubcategoryProducts } from "./SubcategoryProducts";
import { API } from "../config";
import Layout from "./Layout";

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

  const isSubcategory = !!category.parent;

  return (
    <Box>

      {isSubcategory ? (
        <SubcategoryProducts />
      ) : (
        category.subcategories.length > 0 && (
          <Layout title='' description=''>
            <Box py={6}>
              <Grid container spacing={2}>
                {category.subcategories.map(sub => (
                  <Grid size={3} key={sub._id}>
                    <Link href={`/category/${sub._id}`} underline="none">
                      <Box
                        sx={{
                          position: "relative",
                          backgroundImage: `url(${API}/product/photo/${sub.products[0]?._id})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          backgroundColor: "#111",
                          height: "340px",
                          borderRadius: "18px",
                          overflow: "hidden",
                          cursor: "pointer",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%)",
                            borderRadius: "18px",
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 24,
                              left: 0,
                              right: 0,
                              textAlign: "center",
                              color: "white",
                              zIndex: 1,
                            }}
                          >
                            <Typography variant="h4"
                              style={{
                                fontSize: "1.4rem",
                                fontFamily: "Playfair Display, serif",
                                marginBottom: "8px"
                              }}
                            >{sub.name}</Typography>
                            <Typography variant="body2" color="grey.200" letterSpacing='0.14em' fontSize=".8rem" fontFamily='Playfair Display, serif'>VIEW SERIES</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Layout>
        )
      )}
    </Box >

  );
};

export default Category;