import React, { useState } from "react";
import type { CheckboxProps } from "../types";

const Checkbox: React.FC<CheckboxProps> = ({ categories, handleFilters }) => {
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
        <ul>
            {categories.map((category) => (
                <li key={category._id} className="list-unstyled">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        onChange={handleToggle(category._id!)}
                        checked={checked.includes(category._id!)}
                    />
                    <label className="form-check-label">{category.name}</label>
                </li>
            ))}
        </ul>
    );
};

export default Checkbox;
