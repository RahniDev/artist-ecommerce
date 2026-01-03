import { useNavigate } from "react-router-dom";
import { addItem } from "./cartHelpers";
import type { AddToCartButtonProps } from "../types";
import { useTranslation } from "react-i18next";

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  redirect = true,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleAddToCart = () => {
    addItem(product, () => {
      if (redirect) {
        navigate("/cart");
      }
    });
  };

  return (
    <button onClick={handleAddToCart}>
      {t("Add to cart")}
    </button>
  );
};

export default AddToCartButton;
