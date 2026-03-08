import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchProduct } from "../redux/slices/productSlice";
import type { RootState, AppDispatch } from "../redux/store";
import ShowImage from "./ShowImage";

const FeaturedPainting = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { product, loading, error } = useSelector(
    (state: RootState) => state.product
  );

  useEffect(() => {
    // Fetch a specific product - replace 'product-id-here' with actual ID
    // You might get this ID from props, another Redux state, or a constant
    dispatch(fetchProduct('69ab648c2be06ad0f2e25a0e'));
  }, [dispatch]);

  // Show loading state
  if (loading) {
    return (
      <Box bgcolor="#e8e8e8" p={4} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box bgcolor="#e8e8e8" p={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Show message if no product
  if (!product) {
    return (
      <Box bgcolor="#e8e8e8" p={4}>
        <Typography variant="h2" textAlign="center">
          Featured Painting
        </Typography>
        <Typography textAlign="center">No featured product available</Typography>
      </Box>
    );
  }

  return (
    <Box style={{ backgroundColor: "#e7e7e7", padding: "20px", display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
      <Box style={{ width: "50%" }}>
      <Typography variant="h2" textAlign="center">
        {product.name}
      </Typography>
       <Typography variant="body1" textAlign="center" color="textSecondary">
        {product.description}
      </Typography>
      </Box>
      <Box style={{ width: "50%" }}>
        <ShowImage item={product} url='product' />
      </Box>
    </Box>
  );
};

export default FeaturedPainting;