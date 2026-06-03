import React, { useState } from "react";
import type { ShowImageProps } from "../types";;
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { API } from "../config";

const ShowImage: React.FC<ShowImageProps> = (props) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const { item, url, width, showAll } = props;

  const imgSx = {
    width: width,
    transition: "transform 0.3s ease",
    "&:hover": { transform: "scale(1.02)" }
  };

  const lightingStyles = {
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
  };

  const getPhotoUrl = (index: number) =>
    item.photos?.[index]?.url || `${API}/${url}/photo/${item._id}?index=${index}`;

  const photoCount = Array.isArray(item.photos) && item.photos.length > 0
    ? item.photos.length
    : item.photoCount ?? 1;
  const indices = Array.from({ length: photoCount }, (_, i) => i);
  const safeIndex = Math.max(0, Math.min(activeIndex, photoCount - 1));

  const lighting = lightingStyles[props.lightingMode ?? "daylight"];
  const activeSrc = getPhotoUrl(safeIndex);

  // Single image
  if (!showAll) {
    return (
      <Box
        component="img"
        src={getPhotoUrl(0)}
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
            src={getPhotoUrl(index)}
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
          sx={{
            position: "relative",
            display: "inline-flex",
            overflow: "hidden",
            borderRadius: 1,
            bgcolor: "#111",
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: lighting.overlay,
              mixBlendMode: "multiply",
            },
          }}
        >
          <Box
            component="img"
            src={getPhotoUrl(safeIndex)}
            alt={`${item.name ?? "Product"} photo ${safeIndex + 1}`}
            onClick={() => activeSrc && props.onImageClick?.(activeSrc)}
            sx={{
              ...imgSx,
              display: "block",
              filter: lighting.filter,
            }}
          />
        </Box>

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