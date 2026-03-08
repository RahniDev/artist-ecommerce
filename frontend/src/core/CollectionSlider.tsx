import { useState, useEffect } from "react";
import type { IProduct } from "../types";
import { API } from "../config";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ProductCard from "./ProductCard";
import { Box, Typography } from "@mui/material";

const CollectionSlider = ({ subcategoryId }: { subcategoryId: string }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [collectionTitle, setCollectionTitle] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`${API}/products/subcategory/${subcategoryId}`).then(res => res.json()),
      fetch(`${API}/category/${subcategoryId}`).then(res => res.json()),
    ]).then(([productsData, categoryData]) => {
      setProducts(productsData.data ?? []);
      setCollectionTitle(categoryData.name ?? "");
    });
  }, [subcategoryId]);

  return (
    <>
      <Typography variant="h2" textAlign="center">{collectionTitle}</Typography>
      <Typography variant="subtitle1" textAlign="center" 
      fontFamily="playfair display"
      fontStyle="italic"
      sx={{ mt: "2px !important", color: "#222" }}>
        Series </Typography>
      <Box sx={{ position: "relative", mx: 6, overflow: "visible !important" }}>        <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={16}
        breakpoints={{
          600: { slidesPerView: 2 },
          900: { slidesPerView: 3 },
          1200: { slidesPerView: 4 },
        }}
      >
        {products.map(p => (
          <SwiperSlide key={p._id}>
            <ProductCard product={{ ...p, count: 1 }} />
          </SwiperSlide>
        ))}
      </Swiper>
      </Box>
    </>
  );
};

export default CollectionSlider;