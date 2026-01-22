import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "./Layout";
import ProductCard from "./Card";
import { read, listRelated } from "./apiCore";
import type { IProduct } from "../types";
import SoldBadge from "./SoldBadge";
import AddToCartButton from "./AddToCartButton";
import ShowImage from "./ShowImage";
import {
  Box,
  Typography,
  Grid,
} from "@mui/material";

const Product: React.FC = () => {

  const [product, setProduct] = useState<IProduct | null>(null);
  const [related, setRelated] = useState<IProduct[]>([]);

  const { productId } = useParams<{ productId: string }>();

  useEffect(() => {
    if (!productId) return;

    const loadSingleProduct = async () => {
      const productRes = await read(productId);

      if (productRes.error) {
        console.error(productRes.error);
        return;
      }

      setProduct(productRes.data!);

      const relatedRes = await listRelated(productId);
      if (!relatedRes.error) {
        setRelated(relatedRes.data?.data ?? []);
      }
    };

    loadSingleProduct();
  }, [productId]);

  return (
    <Layout title="" description="">
      <Grid container spacing={2}>
        <Grid size={12}>
          {product && (
            <Box>
              <Grid container
                alignItems="center">
                <Grid size={6}>
                  <ShowImage item={product} url="product" />
                </Grid>

                <Grid size={6}>
                  <Typography variant="h4" fontWeight="bold">
                    {product.name}
                  </Typography>

                  <Typography variant="body1" color="text.secondary">
                    {product.description}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {product.category?.name ?? "Uncategorized"}
                  </Typography>
                  <Typography
                    variant="h5"
                    color="success.main"
                    fontWeight="bold"
                    gutterBottom
                  >
                    € {product.price}
                  </Typography>
                  <SoldBadge quantity={product.quantity} />
                  <AddToCartButton
                    product={{ ...product, count: 1 }}
                    redirect={false}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </Grid>
        
        <Grid container spacing={3} mt={6} p={3}>
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
