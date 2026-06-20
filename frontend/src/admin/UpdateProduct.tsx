import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { API } from "../config";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { getCategories, updateProduct } from "./apiAdmin";
import { getProduct } from "../core/apiCore";
import type {
    Category,
    ApiResponse,
    IProduct,
    UpdateProductValues,
    ProductFormField,
} from "../types";
import Loader from "../core/Loader";
import {
    Box,
    Button,
    Container,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Alert,
    Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { PAINT_COLOR_OPTIONS } from "../../../shared/colourPalette";

const UpdateProduct = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const auth = isAuthenticated();

    if (!auth) {
        return <Navigate to="/signin" replace />;
    }

    const { user, token } = auth;

    const [photosPreview, setPhotosPreview] = useState<string[]>([]);
    const [values, setValues] = useState<UpdateProductValues>({
        name: "",
        description: "",
        price: "",
        weight: "",
        width: "",
        height: "",
        length: "",
        categories: [],
        category: "",
        photos: [],
        loading: false,
        error: "",
        updatedProduct: false,
        updatedProductName: "",
        material: "",
        medium: "",
        colors: [],
        framing: "",
        additionalDetails: "",
        quality: "",
    });

    const {
        name,
        description,
        price,
        categories,
        category,
        loading,
        error,
        updatedProduct,
        updatedProductName,
        material,
        medium,
        colors,
        framing,
        additionalDetails,
        quality,
    } = values;

    const formData = useRef<FormData | null>(null);

    useEffect(() => {
        if (!productId) return;

        const init = async () => {
            await loadCategories();
            await initProduct(productId);
        };

        init();
    }, [productId]);

    useEffect(() => {
        return () => {
            photosPreview.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [photosPreview]);

    useEffect(() => {
        if (!updatedProduct) return;

        const timer = setTimeout(() => {
            navigate("/");
            setValues((prev) => ({
                ...prev,
                updatedProductName: "",
            }));
        }, 1500);

        return () => clearTimeout(timer);
    }, [updatedProduct, navigate]);

    const loadCategories = async () => {
        try {
            const res: ApiResponse<Category[]> = await getCategories();
            if (res.error) {
                setValues((prev) => ({ ...prev, error: res.error || "" }));
                return;
            }

            setValues((prev) => ({
                ...prev,
                categories: res.data ?? [],
            }));
        } catch {
            setValues((prev) => ({
                ...prev,
                error: "Failed to load categories",
            }));
        }
    };

    const initProduct = async (id: string) => {
        try {
            const res: ApiResponse<IProduct> = await getProduct(id);

            if (res.error || !res.data) {
                setValues((prev) => ({
                    ...prev,
                    error: res.error ?? "Failed to load product",
                }));
                return;
            }

            const product = res.data;

            const descriptionValue =
                typeof product.description === "string"
                    ? product.description
                    : JSON.stringify(product.description);

            const fd = new FormData();
            fd.set("name", product.name ?? "");
            fd.set("description", descriptionValue);
            fd.set("price", product.price?.toString() ?? "");
            fd.set("category", product.category?._id ?? "");
            fd.set("material", product.material ?? "");
            fd.set("medium", product.medium ?? "");
            fd.set("framing", product.framing ?? "");
            fd.set("quality", product.quality ?? "");
            fd.set("additionalDetails", product.additionalDetails ?? "");
            fd.set("weight", product.weight?.toString() ?? "");
            fd.set("width", product.width?.toString() ?? "");
            fd.set("height", product.height?.toString() ?? "");
            fd.set("length", product.length?.toString() ?? "");

            (product.colors ?? []).forEach((color: string) => {
                fd.append("colors", color);
            });

            formData.current = fd;

            setValues((prev) => ({
                ...prev,
                name: product.name ?? "",
                description: descriptionValue,
                price: product.price?.toString() ?? "",
                category: product.category?._id ?? "",
                material: product.material ?? "",
                medium: product.medium ?? "",
                framing: product.framing ?? "",
                quality: product.quality ?? "",
                additionalDetails: product.additionalDetails ?? "",
                colors: product.colors ?? [],
                weight: product.weight?.toString() ?? "",
                width: product.width?.toString() ?? "",
                height: product.height?.toString() ?? "",
                length: product.length?.toString() ?? "",
            }));
        } catch {
            setValues((prev) => ({
                ...prev,
                error: "Failed to load product",
                loading: false,
            }));
        }
    };

    const handleInputChange =
        (field: ProductFormField) =>
            (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                if (!formData.current) return;

                const value = event.target.value;
                formData.current.set(field, value);
                setValues((prev) => ({ ...prev, [field]: value }));
            };

    const handleSelectChange =
        (field: ProductFormField) =>
            (event: SelectChangeEvent<string>) => {
                if (!formData.current) return;

                const value = event.target.value;
                formData.current.set(field, value);
                setValues((prev) => ({ ...prev, [field]: value }));
            };

    const handleCategoryChange = (event: SelectChangeEvent<string>) => {
        if (!formData.current) return;
        const value = event.target.value;
        formData.current.set("category", value);
        setValues((prev) => ({ ...prev, category: value }));
    };

    const handleColorToggle = (hex: string) => {
        if (!formData.current) return;

        const updatedColors = colors.includes(hex)
            ? colors.filter((c) => c !== hex)
            : [...colors, hex];

        formData.current.delete("colors");
        updatedColors.forEach((color) => formData.current!.append("colors", color));

        setValues((prev) => ({
            ...prev,
            colors: updatedColors,
        }));
    };

    const handlePhotoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!formData.current) return;

        const files = Array.from(event.target.files ?? []);
        if (!files.length) return;

        for (const file of files) {
            if (!file.type.startsWith("image/")) {
                setValues((prev) => ({ ...prev, error: "File must be an image" }));
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                setValues((prev) => ({
                    ...prev,
                    error: "Each image must be less than 2MB",
                }));
                return;
            }
        }

        formData.current.delete("photos");
        files.forEach((file) => formData.current!.append("photos", file));

        setValues((prev) => ({
            ...prev,
            photos: files,
            error: "",
        }));

        setPhotosPreview(files.map((file) => URL.createObjectURL(file)));
    };

    const clickSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!productId || !formData.current) return;

        setValues((prev) => ({
            ...prev,
            loading: true,
            error: "",
        }));

        try {
            const res: ApiResponse<IProduct> = await updateProduct(
                productId,
                user._id,
                token,
                formData.current
            );

            if (res.error || !res.data) {
                setValues((prev) => ({
                    ...prev,
                    error: res.error ?? "Update failed",
                    loading: false,
                }));
                return;
            }

            const rawName = res.data.name as any;

            setValues((prev) => ({
                ...prev,
                updatedProduct: true,
                updatedProductName:
                    typeof rawName === "object" ? rawName?.en : rawName ?? "",
                loading: false,
            }));
        } catch {
            setValues((prev) => ({
                ...prev,
                error: "Update failed",
                loading: false,
            }));
        }
    };

    return (
        <Layout
            title="Update product"
            description={`Hello ${user.name}, update your product`}
        >
            <Container maxWidth="md">
                <Box sx={{ mt: 4 }}>
                    <Loader loading={loading} />

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {updatedProduct && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {updatedProductName} updated successfully
                        </Alert>
                    )}

                    <Box
                        component="form"
                        onSubmit={clickSubmit}
                        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                        <Typography variant="h6">Painting Photo</Typography>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-around",
                                gap: 2,
                                flexWrap: "wrap",
                            }}
                        >
                            <Button variant="outlined" component="label">
                                Upload Image
                                <input
                                    hidden
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handlePhotoFileChange}
                                />
                            </Button>

                            {productId && photosPreview.length === 0 && (
                                <Box
                                    component="img"
                                    src={`${API}/product/photo/${productId}`}
                                    alt="Product preview"
                                    sx={{ width: 200, borderRadius: 1, border: "1px solid #ddd" }}
                                />
                            )}

                            {photosPreview.map((src, i) => (
                                <Box
                                    key={i}
                                    component="img"
                                    src={src}
                                    alt={`Painting photo preview ${i + 1}`}
                                    sx={{ width: 200, borderRadius: 1, border: "1px solid #ddd" }}
                                />
                            ))}
                        </Box>

                        <TextField
                            label="Title"
                            value={name}
                            onChange={handleInputChange("name")}
                            fullWidth
                            required
                        />

                        <TextField
                            label="Description"
                            value={description}
                            onChange={handleInputChange("description")}
                            multiline
                            rows={4}
                            fullWidth
                        />

                        <TextField
                            label="Price"
                            type="number"
                            value={price}
                            onChange={handleInputChange("price")}
                            fullWidth
                            required
                        />

                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select value={category} label="Category" onChange={handleCategoryChange}>
                                <MenuItem value="">
                                    <em>Please select</em>
                                </MenuItem>
                                {categories.map((c) => (
                                    <MenuItem key={c._id} value={c._id}>
                                        {c.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Material</InputLabel>
                            <Select
                                value={material}
                                label="Material"
                                onChange={handleSelectChange("material")}
                            >
                                <MenuItem value="">
                                    <em>Please select</em>
                                </MenuItem>
                                <MenuItem value="Paper">Paper</MenuItem>
                                <MenuItem value="Canvas">Canvas</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>

                        <Box>
                            <Typography fontWeight={600} sx={{ mb: 1 }}>
                                Colors
                            </Typography>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(30, 18px)",
                                    gap: 1.2,
                                    alignItems: "center",
                                }}
                            >
                                {PAINT_COLOR_OPTIONS.map((color) => {
                                    const selected = colors.includes(color.hex);

                                    return (
                                        <Box
                                            key={color.hex}
                                            onClick={() => handleColorToggle(color.hex)}
                                            title={color.name}
                                            sx={{
                                                width: 20,
                                                height: 20,
                                                borderRadius: "50%",
                                                cursor: "pointer",
                                                backgroundColor: color.hex,
                                                border: selected
                                                    ? "3px solid #111"
                                                    : "1px solid rgba(0,0,0,0.15)",
                                                boxShadow: selected ? "0 0 0 3px rgba(0,0,0,0.12)" : "none",
                                                transition: "all 0.2s ease",
                                                "&:hover": {
                                                    transform: "scale(1.08)",
                                                },
                                            }}
                                        />
                                    );
                                })}
                            </Box>

                            {colors.length > 0 && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                                    Selected:{" "}
                                    {PAINT_COLOR_OPTIONS
                                        .filter((c) => colors.includes(c.hex))
                                        .map((c) => c.name)
                                        .join(", ")}
                                </Typography>
                            )}
                        </Box>

                        <FormControl fullWidth>
                            <InputLabel>Medium</InputLabel>
                            <Select
                                value={medium}
                                label="Medium"
                                onChange={handleSelectChange("medium")}
                            >
                                <MenuItem value="">
                                    <em>Please select</em>
                                </MenuItem>
                                <MenuItem value="Watercolour">Watercolour</MenuItem>
                                <MenuItem value="Acrylic">Acrylic</MenuItem>
                                <MenuItem value="Oil pastel">Oil pastel</MenuItem>
                                <MenuItem value="Gouache">Gouache</MenuItem>
                                <MenuItem value="Ink">Ink</MenuItem>
                                <MenuItem value="Charcoal">Charcoal</MenuItem>
                                <MenuItem value="Mixed media">Mixed media</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Width (cm)"
                            type="number"
                            value={values.width}
                            onChange={handleInputChange("width")}
                            fullWidth
                        />

                        <TextField
                            label="Height (cm)"
                            type="number"
                            value={values.height}
                            onChange={handleInputChange("height")}
                            fullWidth
                        />

                        <FormControl fullWidth>
                            <InputLabel>Framing</InputLabel>
                            <Select
                                value={framing}
                                label="Framing"
                                onChange={handleSelectChange("framing")}
                            >
                                <MenuItem value="">
                                    <em>Please select</em>
                                </MenuItem>
                                <MenuItem value="Unframed">Unframed</MenuItem>
                                <MenuItem value="Ready to hang">Ready to hang</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Quality</InputLabel>
                            <Select
                                value={quality}
                                label="Quality"
                                onChange={handleSelectChange("quality")}
                            >
                                <MenuItem value="">
                                    <em>Please select</em>
                                </MenuItem>
                                <MenuItem value="Low quality">Low quality</MenuItem>
                                <MenuItem value="Medium quality">Medium quality</MenuItem>
                                <MenuItem value="High quality">High quality</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Additional Details e.g: painting scuffed on the bottom left"
                            value={additionalDetails}
                            onChange={handleInputChange("additionalDetails")}
                            multiline
                            rows={4}
                            fullWidth
                        />

                        <Typography>Only required for shipping:</Typography>

                        <TextField
                            label="Weight (grams)"
                            type="number"
                            value={values.weight}
                            onChange={handleInputChange("weight")}
                            fullWidth
                        />

                        <TextField
                            label="Length (cm)"
                            type="number"
                            value={values.length}
                            onChange={handleInputChange("length")}
                            fullWidth
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{ mt: 2 }}
                            disabled={loading}
                        >
                            Update Painting
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Layout>
    );
};

export default UpdateProduct;