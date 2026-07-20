import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
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
import ShowImage from "../core/ShowImage";

const UpdateProduct = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const auth = isAuthenticated();

    if (!auth) {
        return <Navigate to="/signin" replace />;
    }

    const { user, token } = auth;

    const [photosPreview, setPhotosPreview] = useState<string[]>([]);
    const [product, setProduct] = useState<IProduct | null>(null);
    const [values, setValues] = useState<UpdateProductValues>({
        name: "",
        price: "",
        weight: "",
        size: "",
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
        framing: "",
        additionalDetails: "",
    });

    const {
        name,
        price,
        size,
        categories,
        category,
        loading,
        error,
        updatedProduct,
        updatedProductName,
        material,
        medium,
        framing,
        additionalDetails,
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
            setProduct(product);
            const fd = new FormData();
            fd.set("name", product.name ?? "");
            fd.set("price", product.price?.toString() ?? "");
            fd.set("category", product.category?._id ?? "");
            fd.set("material", product.material ?? "");
            fd.set("medium", product.medium ?? "");
            fd.set("framing", product.framing ?? "");
            fd.set("additionalDetails", product.additionalDetails ?? "");
            fd.set("weight", product.weight?.toString() ?? "");
            fd.set("size", product.size?.toString() ?? "");
            fd.set("length", product.length?.toString() ?? "");

            formData.current = fd;

            setValues((prev) => ({
                ...prev,
                name: product.name ?? "",
                price: product.price?.toString() ?? "",
                category: product.category?._id ?? "",
                material: product.material ?? "",
                medium: product.medium ?? "",
                framing: product.framing ?? "",
                additionalDetails: product.additionalDetails ?? "",
                weight: product.weight?.toString() ?? "",
                size: product.size?.toString() ?? "",
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
    const productPhoto = photosPreview.length > 0
        ? {
            _id: product?._id ?? "",
            photos: photosPreview.map((url) => ({ url })),
        }
        : product;
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

                            {productPhoto && (
                                <ShowImage
                                    item={productPhoto}
                                    url="product"
                                    sizes="60px"
                                    width={60}
                                    height={60}
                                    showAll
                                />
                            )}
                        </Box>

                        <TextField
                            label="Title"
                            value={name}
                            onChange={handleInputChange("name")}
                            fullWidth
                            required
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
                            value={values.size}
                            onChange={handleInputChange("size")}
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