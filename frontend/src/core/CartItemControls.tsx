import { useState } from "react";
import { updateItem, removeItem } from "./cartHelpers";

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

  return (
    <>
      <div className="input-group mb-2">
        <span className="input-group-text">Qty</span>
        <input
          type="number"
          className="form-control"
          value={count}
          onChange={handleChange}
        />
      </div>

      <button
        className="btn btn-outline-danger btn-sm"
        onClick={() => {
          removeItem(productId);
          setRun(!run);
        }}
      >
        Remove
      </button>
    </>
  );
};

export default CartItemControls;
