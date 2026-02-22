import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchProduct, clearProduct } from "../redux/slices/productSlice";

import Layout from "./Layout";
import ProductCard from "./ProductCard";
import SoldBadge from "./SoldBadge";
import AddToCartButton from "./AddToCartButton";
import ProductBreadcrumbs from "./ProductBreadcrumbs";
import ShowImage from "./ShowImage";
import { Box, Typography, Grid } from "@mui/material";

const Product: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { product, related, loading, error } = useSelector(
    (state: RootState) => state.product
  );

  useEffect(() => {
    if (!productId) return;

    dispatch(fetchProduct(productId));

    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, productId]);

  return (
    <Layout title="" description="">
      <Grid container spacing={2} p={3}>
        <Grid size={12}>
          {loading && <Typography>Loading...</Typography>}
          {error && <Typography color="error">{error}</Typography>}

          {product && (
            <Box>
              <ProductBreadcrumbs product={product} />

              <Grid container alignItems="center">
                <Grid size={6}>
                  <ShowImage
                    item={product}
                    url="product"
                    width={380}
                    height={380}
                  />
                </Grid>

                <Grid size={6}>
                  <Typography variant="h4" fontWeight="bold">
                    {product.name}
                  </Typography>

                  <Typography variant="body1" color="text.secondary">
                    {product.description}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {product.category?.name ?? "Uncategorized"}
                  </Typography>

                  <SoldBadge quantity={product.quantity} />
                  {product.quantity > 0 && (
                    <>
                      <Typography
                        variant="h5"
                        color="success.main"
                        fontWeight="bold"
                      >
                        € {product.price}
                      </Typography>
                      <AddToCartButton
                        product={{ ...product, count: 1 }}
                        redirect={false}
                      />  </>)}
                </Grid>
              </Grid>
            </Box>
          )}
        </Grid>

        <Grid container spacing={3} mt={6}>
          {related.slice(0, 4).map((p) => (
            <Grid size={12} key={p._id}>
              <ProductCard product={{ ...p, count: 1 }} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Product;