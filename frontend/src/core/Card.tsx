import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ShowImage from "./ShowImage";
import { addItem, updateItem, removeItem } from "./cartHelpers";
import type { ICartItem } from "../types";

interface CardProps {
    product: ICartItem;
    showViewProductButton?: boolean;
    showAddToCartButton?: boolean;
    cartUpdate?: boolean;
    showRemoveProductButton?: boolean;
    setRun?: (value: boolean) => void;
    run?: boolean;
}

const Card: React.FC<CardProps> = ({
    product,
    showAddToCartButton = true,
    cartUpdate = false,
    showRemoveProductButton = false,
    setRun = () => { },
    run = false,
}) => {
    const navigate = useNavigate();
    const [count, setCount] = useState(product.count ?? 1);


    const addToCart = () => {
        addItem(product, () => {
            navigate("/cart");
        });
    };

    const showAddToCartBtn = (show: boolean) =>
        show && (
            <button
                onClick={addToCart}
                className="btn btn-outline-warning mt-2 mb-2 card-btn-1"
            >
                Add to cart
            </button>
        );

    const showStock = (quantity: number) => {
        return quantity > 0 ? (
            <span className="badge badge-primary badge-pill in-stock">
                In Stock
            </span>
        ) : (
            <span className="badge badge-primary badge-pill out-of-stock">
                Out of Stock
            </span>
        );
    };

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
        <div className="card-body mx-auto">
            <Link to={`/product/${product._id}`}>
                <ShowImage item={product} url="product" />

                <div className="product-header">{product.name}</div>

                <p className="p-info p-desc mt-2">
                    {product.description.substring(0, 100)}
                </p>

                <p className="p-info">£ {product.price}</p>

                {showStock(product.quantity)}

                <br />

                {showAddToCartBtn(showAddToCartButton)}

                {showRemoveButton(showRemoveProductButton)}

                {showCartUpdateOptions(cartUpdate)}
            </Link>
        </div>
    );
};

export default Card;
