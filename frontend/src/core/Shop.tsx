import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Divider,
    Slider,
    Paper,
} from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import ProductCard from "./ProductCard";
import Layout from "./Layout";
import type { IProduct } from "../types";
import { API } from '../config'

const Shop = () => {
    const [products, setProducts] = useState<IProduct[]>([]);

    const [filters, setFilters] = useState({
        material: [] as string[],
        framing: [] as string[],
        price: [0, 5000] as number[],
        size: [] as string[],
        medium: [] as string[],
        colors: [] as string[]
    });

    const COLOR_SWATCHES = [
        { label: "red", hex: "#C62828" },
        { label: "orange", hex: "#EF6C00" },
        { label: "yellow", hex: "#FDD835" },
        { label: "green", hex: "#43A047" },
        { label: "blue", hex: "#1E88E5" },
        { label: "purple", hex: "#8E24AA" },
        { label: "pink", hex: "#D81B60" },
        { label: "brown", hex: "#6D4C41" },
        { label: "black", hex: "#212121" },
        { label: "white", hex: "#FFFFFF" },
        { label: "grey", hex: "#9E9E9E" },
    ];

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

    return (
        <Layout title="" description="Browse all paintings">
            <Box
                sx={{
                    display: "flex",
                    gap: 4,
                    alignItems: "flex-start",
                }}
            >
                {/* Filters */}
                <Paper
                    elevation={0}
                    sx={{
                        width: 260,
                        p: 3,
                        position: "sticky",
                        top: 100,
                    }}
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
                            gridTemplateColumns: "repeat(5, 32px)",
                            gap: 1,
                        }}
                    >
                        {COLOR_SWATCHES.map((color) => {
                            const selected = filters.colors.includes(color.label);

                            return (
                                <Box
                                    key={color.label}
                                    onClick={() => handleCheckbox("colors", color.label)}
                                    title={color.label}
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: "50%",
                                        cursor: "pointer",
                                        backgroundColor: color.hex,
                                        border: selected
                                            ? "3px solid #111"
                                            : color.label === "white"
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

                {/* Products */}
                <Box sx={{ flex: 1 }}>
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
        </Layout>
    );
};

export default Shop;