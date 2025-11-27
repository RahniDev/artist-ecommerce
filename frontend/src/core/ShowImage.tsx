import React from "react";
import type { IProduct } from "../types";
import { API } from "../config";

interface ShowImageProps {
  item: IProduct | { _id: string; name?: string };
  url: string;
}

const ShowImage: React.FC<ShowImageProps> = ({ item, url }) => {
  return (
    <div className="product-img">
      <img
        src={`${API}/${url}/photo/${item._id}`}
        alt={item.name ?? "Product Image"}
        className="mb-3"
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
