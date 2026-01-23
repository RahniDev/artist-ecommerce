import React from "react";
import type { ShowImageProps } from "../types";
import { API } from "../config";
import Box from "@mui/material/Box";

const ShowImage: React.FC<ShowImageProps> = ({
  item,
  url,
  width = 200,
  height = 200,
  objectFit = "cover",
}) => {
  return (
    <Box
      component="img"
      src={`${API}/${url}/photo/${item._id}`}
      alt={item.name ?? "Product Image"}
      sx={{ width, height, objectFit }}
    />
  );
};

export default ShowImage;