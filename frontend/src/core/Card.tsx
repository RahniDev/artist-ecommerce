import { Link } from "react-router-dom";
import ShowImage from "./ShowImage";
import type { CardProps } from "../types";
import Card from "@mui/material/Card";
import SoldBadge from "./SoldBadge";
import AddToCartButton from "./AddToCartButton";

const ProductCard: React.FC<CardProps> = ({
    product,
    showAddToCartButton = true,
}) => {

    return (
        <Card sx={{ width: '300px' }}>
            <Link to={`/product/${product._id}`}>
                <ShowImage
                    item={product}
                    url="product"
                    width={220}
                    height={220}
                />
                <div className="product-header">{product.name}</div>
                <p className="p-info">€ {product.price}</p>
                <SoldBadge quantity={product.quantity} />
                <br />
                {showAddToCartButton && (
                    <AddToCartButton product={product} />
                )}
            </Link>
        </Card>
    );
};

export default ProductCard;
