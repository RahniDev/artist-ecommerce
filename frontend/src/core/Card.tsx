import { useState } from "react";
import { Link } from "react-router-dom";
import ShowImage from "./ShowImage";
import { updateItem, removeItem } from "./cartHelpers";
import type { ICartItem } from "../types";
import Card from "@mui/material/Card";
import StockBadge from "./StockBadge";
import AddToCartButton from "./AddToCartButton";

interface CardProps {
    product: ICartItem;
    showViewProductButton?: boolean;
    showAddToCartButton?: boolean;
    cartUpdate?: boolean;
    showRemoveProductButton?: boolean;
    setRun?: (value: boolean) => void;
    run?: boolean;
}

const ProductCard: React.FC<CardProps> = ({
    product,
    showAddToCartButton = true,
    cartUpdate = false,
    showRemoveProductButton = false,
    setRun = () => { },
    run = false,
}) => {
    const [count, setCount] = useState(product.count ?? 1);

    const handleChange =
        (productId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = Number(e.target.value);
            const updatedValue = value < 1 ? 1 : value;

            setCount(updatedValue);
            setRun(!run);

            updateItem(productId, updatedValue);
        };

    const showCartUpdateOptions = (show: boolean) =>
        show && (
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text">Adjust Quantity</span>
                </div>
                <input
                    type="number"
                    className="form-control"
                    value={count}
                    onChange={handleChange(product._id)}
                />
            </div>
        );

    const showRemoveButton = (show: boolean) =>
        show && (
            <button
                onClick={() => {
                    removeItem(product._id);
                    setRun(!run);
                }}
                className="btn btn-outline-danger mt-2 mb-2"
            >
                Remove Product
            </button>
        );

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

                {showRemoveButton(showRemoveProductButton)}
                {showCartUpdateOptions(cartUpdate)}
            </Link>
        </Card>
    );
};

export default ProductCard;
