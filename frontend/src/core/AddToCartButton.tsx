import { useNavigate } from "react-router-dom";
import { addItem } from "./cartHelpers";
import type { AddToCartButtonProps } from "../types";

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  redirect = true,
  className = "btn btn-outline-warning mt-2 mb-2 card-btn-1",
}) => {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addItem(product, () => {
      if (redirect) {
        navigate("/cart");
      }
    });
  };

  return (
    <button onClick={handleAddToCart} className={className}>
      Add to cart
    </button>
  );
};

export default AddToCartButton;
