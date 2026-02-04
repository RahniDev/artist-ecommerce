import React, { useState } from "react";
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import type { RadioBoxProps } from "../types";

const RadioBox: React.FC<RadioBoxProps> = ({ prices, handleFilters }) => {
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(event.target.value);
    setValue(val);
    handleFilters(val);
  };

  return (
    <FormControl>
      <RadioGroup
        name="price"
        value={value}
        onChange={handleChange}
      >
        {prices.map((p) => (
          <FormControlLabel
            key={p._id}
            value={p._id}
            control={<Radio />}
            label={p.name}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioBox;
