import { Link } from "react-router-dom";
import ShowImage from "./ShowImage";
import type { CardProps } from "../types";
import Card from "@mui/material/Card";
import SoldBadge from "./SoldBadge";
import AddToCartButton from "./AddToCartButton";

const ProductCard: React.FC<CardProps> = ({
    product
}) => {

    return (
        <Card sx={{ width: '240px', textAlign: "center" }}>
            <Link to={`/product/${product._id}`}>
                <ShowImage
                    item={product}
                    url="product"
                    width={240}
                    height={240}
                />
                <div className="product-header">{product.name}</div>
                <p className="p-info">€ {product.price}</p>
                <SoldBadge quantity={product.quantity} />
                {product.quantity > 0 && (
                    <AddToCartButton product={product} />
                )}
            </Link>
        </Card>
    );
};

export default ProductCard;
