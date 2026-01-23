import React, { useState } from "react";
import type { RadioBoxProps } from "../types";

const RadioBox: React.FC<RadioBoxProps> = ({ prices, handleFilters }) => {
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(event.target.value);
    setValue(val);
    handleFilters(val);
  };

  return (
    <>
      {prices.map((p) => (
        <div key={p._id}>
          <input
            type="radio"
            name="price"
            value={p._id}
            checked={value === p._id}
            onChange={handleChange}
          />
          <label>{p.name}</label>
        </div>
      ))}
    </>
  );
};

export default RadioBox;
