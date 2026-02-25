import React from "react";
import type { ShowImageProps } from "../types";
import { API } from "../config";
import Box from "@mui/material/Box";

const ShowImage: React.FC<ShowImageProps> = ({
  item,
  url,
  width = "100%",
  objectFit = "contain"
}) => {
  return (
    <Box
      component="img"
      src={`${API}/${url}/photo/${item._id}`}
      alt={item.name ?? "Product Image"}
      sx={{
        width: "100%",
        height: "auto",
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "scale(1.02)"
        }
      }}
    />
  );
};

export default ShowImage;