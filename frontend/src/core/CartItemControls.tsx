import { useState } from "react";
import { updateItem, removeItem } from "./cartHelpers";
import {
  Box,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

type Props = {
  productId: string;
  initialCount: number;
  run: boolean;
  setRun: (v: boolean) => void;
};

const CartItemControls: React.FC<Props> = ({
  productId,
  initialCount,
  run,
  setRun,
}) => {
  const [count, setCount] = useState(initialCount);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Number(e.target.value));
    setCount(value);
    updateItem(productId, value);
    setRun(!run);
  };

  const handleRemove = () => {
    removeItem(productId);
    setRun(!run);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <TextField
        type="number"
        size="small"
        value={count}
        onChange={handleChange}
        sx={{ width: 80 }}
      />

      <Tooltip title="Remove item">
        <IconButton color="error" onClick={handleRemove}>
          <DeleteOutlineIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default CartItemControls;
