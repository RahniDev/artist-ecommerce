import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Checkbox,
    Button,
    FormControlLabel,
    FormGroup,
    Divider,
    Slider,
    Paper,
    Chip
} from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import ProductCard from "./ProductCard";
import Layout from "./Layout";
import type { IProduct } from "../types";
import { API } from '../config'
import { PAINT_COLOR_OPTIONS } from "../../../shared/colourPalette";

const Shop = () => {
    const DEFAULT_FILTERS = {
        material: [] as string[],
        framing: [] as string[],
        price: [0, 5000] as number[],
        size: [] as string[],
        medium: [] as string[],
        colors: [] as string[]
    };
    const [products, setProducts] = useState<IProduct[]>([]);
    const [showFilters, setShowFilters] = useState<boolean>(true);
    const [filters, setFilters] = useState(DEFAULT_FILTERS);

    const handleCheckbox = (
        filterName: "material" | "framing" | "size" | "medium" | "colors",
        value: string
    ) => {
        const current = [...filters[filterName]];

        const updated = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];

        setFilters(prev => ({
            ...prev,
            [filterName]: updated,
        }));
    };

    const mediums = [
        "Watercolour",
        "Acrylic",
        "Oil pastel",
        "Gouache",
        "Ink",
        "Charcoal",
        "Mixed media"
    ];

    useEffect(() => {
        loadProducts();
    }, [filters]);

    const loadProducts = async () => {
        try {
            const response = await fetch(`${API}/products/filter`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    order: "desc",
                    sortBy: "createdAt",
                    filters,
                }),
            });

            const data = await response.json();
            setProducts(data.data || []);
        } catch (err) {
            console.error(err);
        }
    };
    const isDefaultPrice =
        filters.price[0] === DEFAULT_FILTERS.price[0] &&
        filters.price[1] === DEFAULT_FILTERS.price[1];

    const clearAllFilters = () => {
        setFilters(DEFAULT_FILTERS);
    };

    const removeFilter = (
        filterName: "material" | "framing" | "size" | "medium" | "colors" | "price",
        value?: string
    ) => {
        if (filterName === "price") {
            setFilters(prev => ({
                ...prev,
                price: DEFAULT_FILTERS.price,
            }));
            return;
        }

        setFilters(prev => ({
            ...prev,
            [filterName]: prev[filterName].filter(item => item !== value),
        }));
    };
    const selectedFilters = [
        ...filters.size.map(value => ({
            key: `size-${value}`,
            label: value,
            filterName: "size" as const,
            value,
        })),
        ...filters.material.map(value => ({
            key: `material-${value}`,
            label: value,
            filterName: "material" as const,
            value,
        })),
        ...filters.medium.map(value => ({
            key: `medium-${value}`,
            label: value,
            filterName: "medium" as const,
            value,
        })),
        ...filters.framing.map(value => ({
            key: `framing-${value}`,
            label: value,
            filterName: "framing" as const,
            value,
        })),
        ...filters.colors.map(value => ({
            key: `color-${value}`,
            label: value,
            filterName: "colors" as const,
            value,
        })),
        ...(!isDefaultPrice
            ? [
                {
                    key: "price",
                    label: `€${filters.price[0]} – €${filters.price[1]}`,
                    filterName: "price" as const,
                },
            ]
            : []),
    ];
    const SIDEBAR_WIDTH = 260;
    return (
        <Layout title="" description="Browse all paintings">
            <Box>
                {/* Top actions */}
                <Box sx={{ mb: 3, display: "flex" }}>
                    <Button
                        onClick={() => setShowFilters(prev => !prev)}
                        sx={{
                            cursor: "pointer",
                            textDecoration: "underline",
                            fontSize: 14,
                            border: "1px solid black",
                            justifyContent: "center",
                            color: "text.secondary",
                            "&:hover": {
                                color: "text.primary",
                            },
                        }}
                    >
                        {showFilters ? "Hide filters" : "Show filters"}
                    </Button>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        gap: 4,
                        alignItems: "flex-start",
                        minHeight: "100vh"
                    }}
                >
                    {/* Filters */}
                    {showFilters && (
                        <Paper
                            sx={{
                                width: SIDEBAR_WIDTH,
                                flexShrink: 0,
                            }}
                            elevation={0}
                        >
                            <Typography variant="h6" gutterBottom>
                                Filters
                            </Typography>

                            <Typography fontWeight={600}>
                                Size
                            </Typography>

                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={filters.size.includes("Small")}
                                            onChange={() => handleCheckbox("size", "Small")}
                                        />
                                    }
                                    label="Small (<30 cm)"
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={filters.size.includes("Medium")}
                                            onChange={() => handleCheckbox("size", "Medium")}
                                        />
                                    }
                                    label="Medium (30–50 cm)"
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={filters.size.includes("Large")}
                                            onChange={() => handleCheckbox("size", "Large")}
                                        />
                                    }
                                    label="Large (50–70 cm)"
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={filters.size.includes("Oversized")}
                                            onChange={() => handleCheckbox("size", "Oversized")}
                                        />
                                    }
                                    label="Oversized (>70 cm)"
                                />
                            </FormGroup>
                            <Divider sx={{ my: 2 }} />
                            <Typography fontWeight={600} mb={1}>
                                Colour
                            </Typography>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(12, 15px)",
                                    gap: 1,
                                }}
                            >
                                {PAINT_COLOR_OPTIONS.map((color) => {
                                    const selected = filters.colors.includes(color.hex);

                                    return (
                                        <Box
                                            key={color.hex}
                                            onClick={() => handleCheckbox("colors", color.hex)}
                                            title={color.hex}
                                            sx={{
                                                width: 18,
                                                height: 18,
                                                borderRadius: "50%",
                                                cursor: "pointer",
                                                backgroundColor: color.hex,
                                                border: selected
                                                    ? "3px solid #111"
                                                    : color.hex === "white"
                                                        ? "1px solid #ccc"
                                                        : "1px solid transparent",
                                                boxSizing: "border-box",
                                                transform: selected ? "scale(1.08)" : "scale(1)",
                                                transition: "all 0.15s ease",
                                            }}
                                        />
                                    );
                                })}
                            </Box>

                            {filters.colors.length > 0 && (
                                <Typography
                                    sx={{
                                        mt: 2,
                                        cursor: "pointer",
                                        textDecoration: "underline",
                                        fontSize: 14,
                                    }}
                                    onClick={() =>
                                        setFilters(prev => ({
                                            ...prev,
                                            colors: [],
                                        }))
                                    }
                                >
                                    Remove colour filter
                                </Typography>
                            )}
                            <Divider sx={{ my: 2 }} />

                            <Typography fontWeight={600}>
                                Material
                            </Typography>

                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={filters.material.includes("Paper")}
                                            onChange={() =>
                                                handleCheckbox("material", "Paper")
                                            }
                                        />
                                    }
                                    label="Paper"
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={filters.material.includes("Canvas")}
                                            onChange={() =>
                                                handleCheckbox("material", "Canvas")
                                            }
                                        />
                                    }
                                    label="Canvas"
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={filters.material.includes("Other")}
                                            onChange={() =>
                                                handleCheckbox("material", "Other")
                                            }
                                        />
                                    }
                                    label="Other"
                                />
                            </FormGroup>

                            <Divider sx={{ my: 2 }} />
                            <Typography fontWeight={600}>
                                Medium
                            </Typography>

                            <FormGroup>
                                {mediums.map(medium => (
                                    <FormControlLabel
                                        key={medium}
                                        control={
                                            <Checkbox
                                                checked={filters.medium.includes(medium)}
                                                onChange={() => handleCheckbox("medium", medium)}
                                            />
                                        }
                                        label={medium}
                                    />
                                ))}
                            </FormGroup>
                            <Divider sx={{ my: 2 }} />

                            <Typography fontWeight={600}>
                                Framing
                            </Typography>

                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={filters.framing.includes(
                                                "Ready to hang"
                                            )}
                                            onChange={() =>
                                                handleCheckbox(
                                                    "framing",
                                                    "Ready to hang"
                                                )
                                            }
                                        />
                                    }
                                    label="Ready to hang"
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={filters.framing.includes(
                                                "Unframed"
                                            )}
                                            onChange={() =>
                                                handleCheckbox(
                                                    "framing",
                                                    "Unframed"
                                                )
                                            }
                                        />
                                    }
                                    label="Unframed"
                                />
                            </FormGroup>

                            <Divider sx={{ my: 2 }} />

                            <Typography fontWeight={600}>
                                Price (€)
                            </Typography>

                            <Slider
                                value={filters.price}
                                onChange={(_, value) =>
                                    setFilters(prev => ({
                                        ...prev,
                                        price: value as number[],
                                    }))
                                }
                                valueLabelDisplay="auto"
                                min={0}
                                max={5000}
                            />
                        </Paper>
                    )}

                    {/* Products */}
                    <Box sx={{ flex: 1, minWidth: 0, alignSelf: "flex-start" }}>
                        {selectedFilters.length > 0 && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 2,
                                }}
                            >
                                <Button
                                    onClick={clearAllFilters}
                                    variant="text"
                                    sx={{
                                        minWidth: "auto",
                                        p: 0,
                                        mr: 1,
                                        textTransform: "none",
                                        textDecoration: "underline",
                                        color: "text.primary",
                                        fontWeight: 500,
                                    }}
                                >
                                    Clear all
                                </Button>

                                {selectedFilters.map(filter => {
                                    if (filter.filterName === "colors") {
                                        return (
                                            <Chip
                                                key={filter.key}
                                                label={
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <Box
                                                            sx={{
                                                                width: 14,
                                                                height: 14,
                                                                borderRadius: "50%",
                                                                backgroundColor: filter.value,
                                                                border:
                                                                    filter.value === "#FFFFFF" || filter.value === "white"
                                                                        ? "1px solid #ccc"
                                                                        : "1px solid transparent",
                                                            }}
                                                        />
                                                    </Box>
                                                }
                                                onDelete={() => removeFilter("colors", filter.value)}
                                                sx={{
                                                    height: 36,
                                                    borderRadius: "999px",
                                                    bgcolor: "#fafafa",
                                                    border: "1px solid #ddd",
                                                    "& .MuiChip-deleteIcon": {
                                                        fontSize: 18,
                                                    },
                                                }}
                                            />
                                        );
                                    }

                                    return (
                                        <Chip
                                            key={filter.key}
                                            label={filter.label}
                                            onDelete={() =>
                                                filter.filterName === "price"
                                                    ? removeFilter("price")
                                                    : removeFilter(filter.filterName, filter.value)
                                            }
                                            sx={{
                                                height: 36,
                                                borderRadius: "999px",
                                                bgcolor: "#fafafa",
                                                border: "1px solid #ddd",
                                                fontSize: 14,
                                                "& .MuiChip-deleteIcon": {
                                                    fontSize: 18,
                                                },
                                            }}
                                        />
                                    );
                                })}
                            </Box>
                        )}

                        <Typography color="text.secondary" mb={4}>
                            {products.length} artworks found
                        </Typography>

                        <Masonry
                            columns={{
                                xs: 1,
                                sm: 2,
                                md: 3,
                            }}
                            spacing={3}
                        >
                            {products.map(product => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                />
                            ))}
                        </Masonry>
                    </Box>
                </Box>
            </Box>
        </Layout>
    );
};

export default Shop;