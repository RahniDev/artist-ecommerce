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

  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);

  useEffect(() => {
    // Get this ID from props, another Redux state, or a constant
    dispatch(fetchProduct('69ab648c2be06ad0f2e25a0e'));
  }, [dispatch, currentLanguage]);


  if (loading) {
    return (
      <Box bgcolor="#e8e8e8" p={4} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

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
        <Typography textAlign="center">No featured painting available</Typography>
      </Box>
    );
  }

  const getLocalizedDescription = () => {
    if (!product.description) return '';
    
    // If description is an object with language keys
    if (typeof product.description === 'object') {
      return product.description[currentLanguage as keyof typeof product.description] || 
             product.description.en || 
             '';
    }
     // If description is already a string (fallback)
    return product.description;
  };
 
  return (
    <Box style={{ backgroundColor: "#e7e7e7", padding: "20px", display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
      <Box style={{ width: "50%" }}>
        <Typography variant="h2" textAlign="center">
          {product.name}
        </Typography>
        <Typography variant="body1" textAlign="center" color="grey.700" fontSize="1.1rem" fontFamily='Playfair Display, serif' mt={2}>
          {getLocalizedDescription()}
        </Typography>
      </Box>
      <Box style={{ width: "50%" }}>
        <ShowImage item={product} url='product' />
      </Box>
    </Box>
  );
};

export default FeaturedPainting;