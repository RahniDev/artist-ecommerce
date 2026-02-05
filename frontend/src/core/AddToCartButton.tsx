import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import type { AddToCartButtonProps } from "../types";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product, redirect = true }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    if (redirect) navigate("/cart");
  };

  return (
    <Button variant="outlined" onClick={handleAddToCart}>
      {t("add_to_cart")}
    </Button>
  );
};

export default AddToCartButton;
