import React, { useState } from "react";
import type { CheckboxProps } from "../types";
import { Checkbox, FormControlLabel, Box } from "@mui/material";

const CategoryCheckbox: React.FC<CheckboxProps> = ({ categories, handleFilters }) => {
    const [checked, setChecked] = useState<string[]>([]);

    const handleToggle = (categoryId: string) => () => {
        const currentIndex = checked.indexOf(categoryId);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(categoryId);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
        handleFilters(newChecked);
    };

    return (
        <Box>
            {categories.map((category) => (
                <FormControlLabel
                    key={category._id}
                    control={
                        <Checkbox
                            checked={checked.includes(category._id)}
                            onChange={handleToggle(category._id)}
                        />
                    }
                    label={category.name}
                />
            ))}
        </Box>
    );
};

export default CategoryCheckbox;
