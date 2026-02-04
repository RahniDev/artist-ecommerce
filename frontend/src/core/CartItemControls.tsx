import { useDispatch } from "react-redux";
import { updateQuantity, removeFromCart } from "../redux/slices/cartSlice";
import { Box, TextField, IconButton, Tooltip } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useState } from "react";

type Props = {
  productId: string;
  initialCount: number;
};

const CartItemControls: React.FC<Props> = ({ productId, initialCount }) => {
  const dispatch = useDispatch();
  const [count, setCount] = useState(initialCount);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Number(e.target.value));
    setCount(value);
    dispatch(updateQuantity({ productId, count: value }));
  };

  const handleRemove = () => {
    dispatch(removeFromCart(productId));
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <TextField type="number" size="small" value={count} onChange={handleChange} sx={{ width: 80 }} />
      <Tooltip title="Remove item">
        <IconButton color="error" onClick={handleRemove}>
          <DeleteOutlineIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default CartItemControls;
