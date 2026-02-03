import { useNavigate } from "react-router-dom";
import { addItem } from "./cartHelpers";
import type { AddToCartButtonProps } from "../types";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";

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
    <Button
      variant="contained"
      sx={{
        backgroundColor: "#fff",
        color: "#000",
        border: "1px solid #000",
         mb: 2,
        textTransform: "none",
        fontWeight: "bold",
        "&:hover": {
          backgroundColor: "#000",
          color: "#fff",
        },
      }}
      onClick={handleAddToCart}
    >
      {t("Add to cart")}
    </Button>
  );
};

export default AddToCartButton;
