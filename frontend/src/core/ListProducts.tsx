import React from "react";
import { Box, Button, Grid } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import ProductCard from "./ProductCard";
import type { ListProductsProps } from "../types";

const ListProducts: React.FC<ListProductsProps> = ({
  products,
  loadMore,
  hasMore,
}) => {

  if (!products?.length) {
    return <p>No products found.</p>;
  }

  return (
    <>
      <Box sx={{ width: "100%" }}>
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
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </Masonry>
      </Box>

      {/* Load More */}
      {hasMore && loadMore && (
        <Grid container justifyContent="center" sx={{ mt: 6 }}>
          <Button
            onClick={loadMore}
            variant="outlined"
            sx={{
              borderColor: "black",
              color: "black",
              px: 4,
              py: 1.5,

              "&:hover": {
                borderColor: "black",
                backgroundColor: "black",
                color: "white",
              },
            }}
          >
            Load More
          </Button>
        </Grid>
      )}
    </>
  );
};

export default React.memo(ListProducts);