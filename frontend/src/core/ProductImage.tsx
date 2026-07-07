import React, { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { API } from "../config";
import type { ProductImageProps } from "../types";

const ProductImage: React.FC<ProductImageProps> = ({
  item,
  url,
  width,
  showAll,
  lightingMode = "daylight",
  sizes = "100vw",
  onImageClick,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const photoCount =
    Array.isArray(item.photos) && item.photos.length > 0
      ? item.photos.length
      : item.photoCount ?? 1;

  const indices = Array.from({ length: photoCount }, (_, i) => i);
  const safeIndex = Math.min(Math.max(activeIndex, 0), photoCount - 1);

  const getPhotoUrl = (index: number) =>
    item.photos?.[index]?.url ||
    `${API}/${url}/photo/${item._id}?index=${index}`;

  const getSrcSet = (index: number) => {
    const photo = item.photos?.[index];
    if (!photo?.sizes) return undefined;

    return `
      ${photo.sizes.xs} 160w,
      ${photo.sizes.sm} 320w,
      ${photo.sizes.md} 640w,
      ${photo.sizes.lg} 960w,
      ${photo.sizes.xl} 1600w
    `;
  };

  const lighting = {
    daylight: {
      filter: "brightness(1.03) contrast(1.02) saturate(1.02)",
      overlay: "rgba(255, 248, 230, 0.08)",
    },
    evening: {
      filter: "sepia(0.16) brightness(0.94) contrast(1.04) saturate(1.08)",
      overlay: "rgba(255, 174, 92, 0.18)",
    },
    gallery: {
      filter: "brightness(0.98) contrast(1.08) saturate(0.96)",
      overlay: "rgba(245, 245, 238, 0.10)",
    },
  }[lightingMode];

  const imgProps = {
    src: getPhotoUrl(safeIndex),
    srcSet: getSrcSet(safeIndex),
    sizes,
    loading: "lazy" as const,
    decoding: "async" as const,
  };

  // Single image
  if (!showAll) {
    return (
      <ProductImage
        item={item}
        url={url}
        sizes={sizes}
        width={width}
        showAll={false}
        onImageClick={onImageClick}
      />
    );
  }

  // Gallery view with thumbnails and navigation
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {/* Thumbnails */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 70 }}>
        {indices.map((i) => (
          <ProductImage
            key={i}
            item={item}
            url={url}
            sizes="60px"
            width={60}
            height={60}
            showAll={false}
            onImageClick={() => setActiveIndex(i)}
          //   objectFit: "cover",
          // cursor: "pointer",
          />
        ))}
      </Box>

      {/* Main image */}
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <IconButton
          onClick={() => setActiveIndex((i) => Math.max(i - 1, 0))}
          disabled={safeIndex === 0}
          sx={{ position: "absolute", left: 0, zIndex: 2 }}
          size="small"
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 1,
            bgcolor: "#111",
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              background: lighting.overlay,
              mixBlendMode: "multiply",
              pointerEvents: "none",
            },
          }}
        >
          <ProductImage
            item={item}
            url={url}
            sizes={sizes}
            width={width}
            showAll={false}
            onImageClick={() => onImageClick?.(imgProps.src)}
          // filter: lighting.filter,
          // cursor: onImageClick ? "zoom-in" : "default",
          />
        </Box>

        <IconButton
          onClick={() => setActiveIndex((i) => Math.min(i + 1, photoCount - 1))}
          disabled={safeIndex === photoCount - 1}
          sx={{ position: "absolute", right: 0, zIndex: 2 }}
          size="small"
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ProductImage;