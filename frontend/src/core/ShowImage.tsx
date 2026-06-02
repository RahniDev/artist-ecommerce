import React, { useState } from "react";
import type { ShowImageProps } from "../types";;
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ShowImage: React.FC<ShowImageProps> = (props) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const { item, width, showAll } = props;

  const imgSx = {
    width: width,
    transition: "transform 0.3s ease",
    "&:hover": { transform: "scale(1.02)" }
  };

  const photoCount = Array.isArray(item.photos) && item.photos.length > 0
    ? item.photos.length
    : item.photoCount ?? 1;
  const indices = Array.from({ length: photoCount }, (_, i) => i);
  const safeIndex = Math.max(0, Math.min(activeIndex, photoCount - 1));

  // Single image
  if (!showAll) {
    return (
      <Box
        component="img"
        src={item.photos?.[0]?.url}
        alt={item.name ?? "Product Image"}
        sx={imgSx}
      />
    );
  }

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {/* Thumbnail column */}
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        minWidth: 70,
      }}>
        {indices.map((index) => (
          <Box
            key={index}
            component="img"
            src={item.photos?.[index]?.url}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            sx={{
              width: 60,
              height: 60,
              minWidth: 60,
              minHeight: 60,
              objectFit: "cover",
              cursor: "pointer",
              borderRadius: 1,
              border: safeIndex === index
                ? "2px solid"
                : "2px solid transparent",
              borderColor: safeIndex === index
                ? "primary.main"
                : "transparent",
              opacity: safeIndex === index ? 1 : 0.6,
              transition: "opacity 0.2s, border-color 0.2s",
              "&:hover": { opacity: 1 }
            }}
          />
        ))}
      </Box>

      {/* Main image with prev/next arrows */}
      <Box sx={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
        <IconButton
          onClick={() => setActiveIndex(i => Math.max(i - 1, 0))}
          disabled={safeIndex === 0}
          size="small"
          sx={{ position: "absolute", left: 0, zIndex: 1 }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        <Box
          component="img"
          src={item.photos?.[safeIndex]?.url}
          alt={`${item.name ?? "Product"} photo ${safeIndex + 1}`}
          sx={{ ...imgSx, display: "block" }}
        />

        <IconButton
          onClick={() => setActiveIndex(i => Math.min(i + 1, photoCount - 1))}
          disabled={safeIndex === photoCount - 1}
          size="small"
          sx={{ position: "absolute", right: 0, zIndex: 1 }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ShowImage;