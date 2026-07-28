import { useEffect, useState } from "react";
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
import ProductImage from "./ShowImage";
import { Box, Typography, Grid } from "@mui/material";
import ImageModal from "./ImageModal";
import { toCartItem } from "../redux/slices/cartSlice";
import Loader from './Loader'

const Product: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalSrc, setModalSrc] = useState<string>("");

  const handleImageClick = (src: string) => {
    setModalSrc(src);
    setModalOpen(true);
  };

  const { product, related, loading, error } = useSelector(
    (state: RootState) => state.product
  );
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);

  useEffect(() => {
    if (!productId) return;

    dispatch(fetchProduct(productId));

    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, productId, currentLanguage]);
const pageBackground = "rgb(250, 250, 250)";
  return (
    <Layout title="" description="" backgroundColor={pageBackground}>
      <Grid container spacing={2} p={3} sx={{ backgroundColor: pageBackground }}>
        <Grid width="100%">
          <Loader loading={loading} />
          {error && <Typography color="error">{error}</Typography>}

          {product && (
            <Box>
              <ProductBreadcrumbs product={product} />

              <Grid container mt={1} width="100%">
                <Grid size={{ xs: 12, md: 6 }} mb={2}>
                  <Box
                    sx={{ cursor: "zoom-in" }}>
                    <ProductImage
                      item={product}
                      url="product"
                      sizes="(max-width: 900px) 100vw, 50vw"
                      width={500}
                      height={400}
                      showAll={true}
                      onImageClick={handleImageClick}
                    />
                  </Box>
                </Grid>
                {/* Add modal at the end, inside the product check */}
                <ImageModal
                  open={modalOpen}
                  src={modalSrc}
                  alt={product.nameEn}
                  onClose={() => setModalOpen(false)}
                />

                <Grid display="flex" flexDirection="column" justifyContent="flex-start" alignItems="center"
                  size={{ xs: 12, md: 6 }} pl={{ md: 6 }}>
                  <Typography variant="h4" fontWeight="bold">
                    {product.nameEn}
                  </Typography>
                  {product.nameEn !== product.name && (
                    <Typography variant="body1" color="text.primary" fontStyle="italic">
                      {product.name}
                    </Typography>)}
                  <Typography variant="body2" color="text.secondary">
                    {product.category?.name ?? "Uncategorized"}
                  </Typography>
                  <Typography variant="body2">{product.medium} on {product.material}</Typography>


                  <Typography sx={{ whiteSpace: "pre-wrap", my: 2 }} variant="body1" color="text.primary">
                    {product.size}
                  </Typography>

                  <SoldBadge quantity={product.quantity} />
                  {product.quantity > 0 && (
                    <>
                      <Typography
                        variant="h5"
                        color="success.main"
                        fontWeight="bold"
                        mb="10px"
                        mt="20px"
                      >
                        € {product.price}
                      </Typography>

                      <AddToCartButton
                        product={toCartItem(product)}
                        redirect={false}
                        aria-label="Collect"
                      />  </>)}
                </Grid>
              </Grid>
            </Box>
          )}
        </Grid>
        <Grid container size={12} spacing={3} mt={2}>
          <Grid size={12}>
            <Typography variant="h5" mt={4}>
              {t("similar_paintings")}
            </Typography>
          </Grid>
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