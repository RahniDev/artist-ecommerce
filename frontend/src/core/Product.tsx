import { useEffect, useState, useRef, useCallback } from "react";
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
import { Box, Typography, Grid, Button } from "@mui/material";
import ImageModal from "./ImageModal";
import { API } from "../config";
import { toCartItem } from "../redux/slices/cartSlice";

const Product: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const [roomImage, setRoomImage] = useState<string>("");
  const [artBox, setArtBox] = useState({
    x: 50,
    y: 50,
    width: 150,
    height: 150,
  });
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalSrc, setModalSrc] = useState<string>("");

  const handleImageClick = (src: string) => {
    setModalSrc(src);
    setModalOpen(true);
  };

  const handleRoomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setRoomImage(url);
  };

  const dragStart = useRef({ x: 0, y: 0 });
  const boxStart = useRef(artBox);

  const onMouseMoveDrag = useCallback((e: MouseEvent) => {
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    setArtBox(prev => ({
      ...prev,
      x: boxStart.current.x + dx,
      y: boxStart.current.y + dy,
    }));
  }, []);

  const onMouseUpDrag = useCallback(() => {
    window.removeEventListener("mousemove", onMouseMoveDrag);
    window.removeEventListener("mouseup", onMouseUpDrag);
  }, [onMouseMoveDrag]);

  const onMouseDownDrag = (e: React.MouseEvent) => {
      dragStart.current = {
    x: e.clientX,
    y: e.clientY,
  };

  boxStart.current = artBox;

    window.addEventListener("mousemove", onMouseMoveDrag);
    window.addEventListener("mouseup", onMouseUpDrag);
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


  useEffect(() => {
    if (!roomImage) return;

    setArtBox({
      x: 50,
      y: 50,
      width: 150,
      height: 150,
    });
  }, [roomImage]);

  const resizeStart = useRef({ w: 0, h: 0, x: 0, y: 0 });

  const onResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();

    resizeStart.current = {
      w: artBox.width,
      h: artBox.height,
      x: e.clientX,
      y: e.clientY,
    };

    window.addEventListener("mousemove", onResizeMove);
    window.addEventListener("mouseup", onResizeUp);
  };

  const onResizeMove = (e: MouseEvent) => {
    const dw = e.clientX - resizeStart.current.x;
    const dh = e.clientY - resizeStart.current.y;

    setArtBox(prev => ({
      ...prev,
      width: Math.max(50, resizeStart.current.w + dw),
      height: Math.max(50, resizeStart.current.h + dh),
    }));
  };

  const onResizeUp = () => {
    window.removeEventListener("mousemove", onResizeMove);
    window.removeEventListener("mouseup", onResizeUp);
  };

  useEffect(() => {
  return () => {
    window.removeEventListener("mousemove", onMouseMoveDrag);
    window.removeEventListener("mouseup", onMouseUpDrag);
    window.removeEventListener("mousemove", onResizeMove);
    window.removeEventListener("mouseup", onResizeUp);
  };
}, [onMouseMoveDrag, onMouseUpDrag]);
  return (
    <Layout title="" description="">
      <Grid container spacing={2} p={3}>
        <Grid width="100%">
          {loading && <Typography>Loading...</Typography>}
          {error && <Typography color="error">{error}</Typography>}

          {product && (
            <Box>
              <ProductBreadcrumbs product={product} />

              <Grid container mt={1} width="100%">
                <Grid size={{ xs: 12, md: 6 }} mb={2}>
                  <Box onClick={() => handleImageClick(`${API}/product/photo/${product._id}`)}
                    sx={{ cursor: "zoom-in" }}>
                    <ShowImage
                      item={product}
                      url="product"
                      width={380}
                      height={380}
                      showAll={true}
                      onImageClick={handleImageClick}
                    />
                  </Box>

                  <Box pt={4}>
                    <Typography variant="h3" fontSize={24}>View on your wall</Typography>
                    <Typography pb={1}> Upload an image of your wall to preview the painting on your wall.</Typography>
                    <Button variant="outlined" component="label">Upload
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={handleRoomUpload}
                      />
                    </Button>
                    <Box display="flex" gap={1} mb={1}>
                      <Button onClick={() => setRoomImage("")}>
                        Remove room image
                      </Button>

                      <Button onClick={() =>
                        setArtBox({ x: 100, y: 100, width: 150, height: 150 })
                      }>
                        Reset position
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        position: "relative",
                        width: 500,
                        height: 350,
                        border: "1px solid #ddd",
                        overflow: "hidden",
                        background: "#f5f5f5",
                      }}
                    >
                      {roomImage && (
                        <img
                          src={roomImage}
                          style={{
                            position: "absolute",
                            inset: 0, width: "100%", height: "100%", objectFit: "cover"
                          }}
                        />
                      )}
                      {roomImage && product && (
                        <div
                          style={{
                            position: "absolute",
                            top: artBox.y,
                            left: artBox.x,
                            width: artBox.width,
                            height: artBox.height,
                            cursor: "move",
                            userSelect: "none",
                          }}
                          onMouseDown={onMouseDownDrag}
                        >
                          {/* artwork */}
                          <img
                            src={`${API}/product/photo/${product._id}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.3))",
                              border: "6px solid white",
                              pointerEvents: "none",
                            }}
                          />

                          {/* resize handle */}
                          <div
                            onMouseDown={onResizeMouseDown}
                            style={{
                              position: "absolute",
                              right: 0,
                              bottom: 0,
                              width: 16,
                              height: 16,
                              background: "white",
                              border: "2px solid black",
                              cursor: "nwse-resize",
                            }}
                          />
                        </div>
                      )}
                    </Box>
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

                  <Typography sx={{ whiteSpace: "pre-wrap", my: 2 }} variant="body1" color="text.primary">
                    {product.description}
                  </Typography>

                  <SoldBadge quantity={product.quantity} />
                  {product.quantity > 0 && (
                    <>
                      <Typography
                        variant="h5"
                        color="success.main"
                        fontWeight="bold"
                        mb="10px"
                      >
                        € {product.price}
                      </Typography>

                      <AddToCartButton
                        product={toCartItem(product)}
                        redirect={false}
                        aria-label="Add to cart"
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