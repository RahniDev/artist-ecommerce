import React from "react";
import type { ShowImageProps } from "../types";
import { API } from "../config";
import Box from "@mui/material/Box";

const ShowImage: React.FC<ShowImageProps> = ({
  item,
  url
}) => {
  return (
    <Box
      component="img"
      src={`${API}/${url}/photo/${item._id}`}
      alt={item.name ?? "Product Image"}
      sx={{     
        width: "80px",   
        height: "90px",
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "scale(1.02)"
        }
      }}
    />
  );
};

export default ShowImage;
