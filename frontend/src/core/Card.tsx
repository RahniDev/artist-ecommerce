import { Link } from "react-router-dom";
import ShowImage from "./ShowImage";
import type { CardProps } from "../types";
import Card from "@mui/material/Card";
import StockBadge from "./StockBadge";
import AddToCartButton from "./AddToCartButton";

const ProductCard: React.FC<CardProps> = ({
    product,
    showAddToCartButton = true,
}) => {

    return (
        <Card variant="outlined">
            <Link to={`/product/${product._id}`}>
                <ShowImage item={product} url="product" />

                <div className="product-header">{product.name}</div>

                <p className="p-info p-desc mt-2">
                    {product.description.substring(0, 100)}
                </p>

                <p className="p-info">€ {product.price}</p>

                <StockBadge quantity={product.quantity} />

                <br />
                {showAddToCartButton && (
                    <AddToCartButton product={product} />
                )}
            </Link>
        </Card>
    );
};

export default ProductCard;
