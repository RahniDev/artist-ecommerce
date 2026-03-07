import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchProduct, clearProduct } from "../redux/slices/productSlice";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
        <Grid>
          {loading && <Typography>Loading...</Typography>}
          {error && <Typography color="error">{error}</Typography>}

          {product && (
            <Box>
              <ProductBreadcrumbs product={product} />

              <Grid container alignItems="center" mt={1}>
                <Grid size={{ xs: 12, md: 6 }} mb={2}>
                  <ShowImage
                    item={product}
                    url="product"
                    width={380}
                    height={380}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }} pl={{ md: 6 }}>
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
                        aria-label="Add to cart"
                      />  </>)}
                </Grid>
              </Grid>
            </Box>
          )}
        </Grid>
          <Typography variant="h5" mt={4}>
            {t("similar_paintings")}
          </Typography>
        <Grid container spacing={3} mt={2}>
          {related.slice(0, 4).map((p) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={p._id}>
              <ProductCard product={{ ...p, count: 1 }} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Product;