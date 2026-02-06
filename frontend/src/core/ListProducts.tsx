import React from "react";
import ProductCard from "./ProductCard";
import { Box, Button, Grid } from "@mui/material";
import type { ListProductsProps } from "../types";

const ListProducts: React.FC<ListProductsProps> = ({ products, loadMore, hasMore }) => {
  if (!products || products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
      >
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </Box>

      {hasMore && loadMore && (
        <Grid container justifyContent="center" sx={{ mt: 3 }}>
          <Button
            onClick={loadMore}
            style={{
              padding: "10px 20px",
              border: "2px solid #000",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          >
            Load More
          </Button>
        </Grid>
      )}
    </>
  );
};
// prevents re-rendering if props have not changed
export default React.memo(ListProducts);
