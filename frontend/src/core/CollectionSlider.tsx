import { useState, useEffect, useRef } from "react";
import type { IProduct } from "../types";
import { API } from "../config";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "./ProductCard";
import { Box, Typography } from "@mui/material";
import SlidePrevButton from "./SlidePrevButton";
import SlideNextButton from "./SlideNextButton";
import { store, type RootState } from "../redux/store";
import { useSelector } from "react-redux";

const CollectionSlider = ({ categoryId }: { categoryId: string }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [collectionTitle, setCollectionTitle] = useState<string>("");
  const swiperRef = useRef<SwiperType | null>(null);

  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
  
  useEffect(() => {
  const lang = store.getState().language.currentLanguage;

  fetch(`${API}/category/${categoryId}?lang=${lang}`)
    .then(res => res.json())
    .then(data => {
      setProducts(data.products ?? []);
      setCollectionTitle(data.name ?? "");
    })
    .catch(err => {
      console.error("Failed to load collection", err);
    });
}, [categoryId, currentLanguage]);

  return (
    <>
      <Typography variant="h2" textAlign="center">Featured Collection</Typography>
      <Typography variant="subtitle1" textAlign="center"
        fontFamily="playfair display"
        fontStyle="italic"
        sx={{ pb: 4, color: "#222" }}>
      {collectionTitle}</Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <SlidePrevButton onClick={() => swiperRef.current?.slidePrev()} />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Swiper
            onSwiper={(swiper) => { swiperRef.current = swiper }}
            id="collection-slider"
            spaceBetween={20}
            slidesPerView={4}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              600: {
                slidesPerView: 2,
              },
              900: {
                slidesPerView: 3,
              },
              1200: {
                slidesPerView: 4,
              },
            }}
          >
            {products.map(p => (
              <SwiperSlide key={p._id}>
                <ProductCard product={{ ...p, count: 1 }} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        <SlideNextButton onClick={() => swiperRef.current?.slideNext()} />
      </Box>
    </>
  );
};

export default CollectionSlider;