import type { IPriceRange } from "../types";

export const prices: IPriceRange[] = [
    {
        _id: 0,
        name: "Any",
        array: [],
    },
    {
        _id: 1,
        name: "€0 to €100",
        array: [0, 100],
    },
    {
        _id: 2,
        name: "€101 to €200",
        array: [101, 200],
    },
    {
        _id: 3,
        name: "€201 to €500",
        array: [201, 500],
    },
    {
        _id: 4,
        name: "€501 to €1000",
        array: [501, 1000],
    },
    {
        _id: 5,
        name: "More than €1000",
        array: [1001, 5000],
    },
];
