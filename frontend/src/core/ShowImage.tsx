import React from "react";
import type { ShowImageProps } from "../types";
import { API } from "../config";

const ShowImage: React.FC<ShowImageProps> = ({ item, url }) => {
  return (
    <div className="product-img">
      <img
        src={`${API}/${url}/photo/${item._id}`}
        alt={item.name ?? "Product Image"}
        style={{
          height: "200px",
          width: "200px",
          objectFit: "cover",
        }}
      />
    </div>
  );
};

export default ShowImage;
