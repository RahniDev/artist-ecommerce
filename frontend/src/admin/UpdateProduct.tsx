import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { API } from '../config'
import { useParams, useNavigate, Navigate } from "react-router-dom";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { getCategories, updateProduct } from "./apiAdmin";
import { getProduct } from "../core/apiCore";
import type { Category, ApiResponse, IProduct, UpdateProductValues, ProductFormField } from "../types";
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
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";

const UpdateProduct = () => {
    const { productId } = useParams<{ productId: string }>();

    const navigate = useNavigate();

    const auth = isAuthenticated();

    if (!auth) {
        return <Navigate to="/signin" replace />;
    }

    const { user } = auth;
    const [photosPreview, setPhotosPreview] = useState<string[]>([])
    const [values, setValues] = useState<UpdateProductValues>({
        name: "",
        description: "",
        price: "",
        categories: [],
        category: "",
        shipping: "",
        quantity: "",
        photos: [],
        loading: false,
        error: "",
        updatedProduct: false,
        updatedProductName: "",
        weight: "",
        width: "",
        height: "",
        length: "",
        subcategory: "",
    });

    const {
        name,
        description,
        price,
        categories,
        category,
        shipping,
        quantity,
        loading,
        error,
        updatedProduct,
        updatedProductName
    } = values;
    // Using useRef instead of useState to avoid re-renders
    // as FormData does not affect the UI, only used when 
    // submitting to the API so should not cause re-render when updated.
    const formData = useRef<FormData | null>(null)

    useEffect(() => {
        if (!productId) return;
        loadCategories();
        initProduct(productId);
    }, [productId]);

    const initProduct = async (id: string) => {
        try {
            const res: ApiResponse<IProduct> = await getProduct(id);
            if (res.error || !res.data) {
                setValues((p) => ({
                    ...p,
                    error: res.error ?? "Failed to load product",
                }));
                return;
            }

            const product = res.data;
            const fd = new FormData()
            fd.set("name", product.name)
            fd.set("description", product.description)
            fd.set("price", product.price.toString())
            fd.set("category", product.category._id)
            fd.set("shipping", product.shipping ? "1" : "0")
            fd.set("quantity", product.quantity.toString())

            formData.current = fd
            setValues((p) => ({
                ...p,
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                category: product.category._id,
                shipping: product.shipping ? "1" : "0",
                quantity: product.quantity.toString()
            }));
        } catch {
            setValues((p) => ({ ...p, error: "Failed to load product", loading: false }));
        }
    };

    useEffect(() => {
        return () => {
            photosPreview.forEach(url => URL.revokeObjectURL(url));
        }
    }, [photosPreview])

    const loadCategories = async () => {
        const res: ApiResponse<Category[]> = await getCategories();
        if (!res.error) {
            setValues((p) => ({ ...p, categories: res.data ?? [] }));
        }
    };

    useEffect(() => {
        if (!updatedProduct) return;

        const timer = setTimeout(() => {
            navigate("/");

            setValues(p => ({
                ...p,
                updatedProductName: ""
            }))
        }, 1500)


        return () => clearTimeout(timer)
    }, [updatedProduct, navigate])

    const handleInputChange =
        (field: ProductFormField) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                if (!formData.current) return;
                const value = e.target.value;
                formData.current.set(field, value);
                setValues((p) => ({ ...p, [field]: value }));
            };

    const handleSelectChange =
        (field: ProductFormField) =>
            (e: SelectChangeEvent<string>) => {
                if (!formData.current) return;

                const value = e.target.value;
                formData.current.set(field, value);
                setValues((p) => ({ ...p, [field]: value }));
            };

    const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!formData.current) return;
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;

        for (const file of files) {
            if (!file.type.startsWith("image/")) {
                setValues(p => ({ ...p, error: "File must be an image" }));
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                setValues(p => ({ ...p, error: "Each image must be less than 2MB" }));
                return;
            }
        }

        formData.current.delete("photos");
        files.forEach(file => formData.current!.append("photos", file));
        setValues(p => ({ ...p, photos: files, error: "" }));
        setPhotosPreview(files.map(file => URL.createObjectURL(file)));
    };

    const clickSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!productId || !formData.current) return;

        setValues((p) => ({ ...p, loading: true, error: "" }));

        try {
            const res: ApiResponse<IProduct> = await updateProduct(
                productId,
                auth.user._id,
                auth.token,
                formData.current
            );

            if (res.error || !res.data) {
                setValues((p) => ({
                    ...p,
                    error: res.error ?? "Update failed",
                    loading: false,
                }));
                return;
            }

            setValues((prev) => ({
                ...prev,
                updatedProduct: true,
                updatedProductName: res.data?.name ?? "",
                loading: false
            }));
        } catch {
            setValues((p) => ({
                ...p,
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
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <Button variant="outlined" component="label">
                            Upload Image
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                multiple
                                onChange={handlePhotoFileChange}
                            />
                        </Button>
                        {productId && photosPreview.length === 0 && (
                            <img src={`${API}/product/photo/${productId}`} alt="Product preview" style={{ width: 200 }} />
                        )}
                        {photosPreview.map((src, i) => (
                            <Box key={i} sx={{ mt: 2 }}>
                                <img src={src} alt={`Product preview ${i + 1}`} style={{ width: 200 }} />
                            </Box>
                        ))}

                        <TextField
                            label="Name"
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
                            <Select
                                value={category}
                                label="Category"
                                onChange={handleSelectChange("category")}
                            >
                                <MenuItem value="">
                                    <em>Select category</em>
                                </MenuItem>
                                {categories.map((c) => (
                                    <MenuItem key={c._id} value={c._id}>
                                        {c.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Shipping</InputLabel>
                            <Select
                                value={shipping}
                                label="Shipping"
                                onChange={handleSelectChange("shipping")}
                            >
                                <MenuItem value="">
                                    <em>Select</em>
                                </MenuItem>
                                <MenuItem value="0">No</MenuItem>
                                <MenuItem value="1">Yes</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Quantity"
                            type="number"
                            value={quantity}
                            onChange={handleInputChange("quantity")}
                            fullWidth
                        />
                        <TextField
                            label="Weight (grams)"
                            type="number"
                            value={values.weight}
                            onChange={handleInputChange("weight")}
                            fullWidth
                        />
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
                            Update Product
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Layout>
    )
};

export default UpdateProduct;