import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { API } from '../config'
import { useParams, useNavigate, Navigate } from "react-router-dom";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { getProduct, getCategories, updateProduct } from "./apiAdmin";
import type { ApiResponse, ICategory, IProduct, UpdateProductValues, ProductFormField } from "../types";
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
    const [imgPreview, setImgPreview] = useState("")
    const [values, setValues] = useState<UpdateProductValues>({
        name: "",
        description: "",
        price: "",
        categories: [],
        category: "",
        shipping: "",
        quantity: "",
        photo: null,
        loading: false,
        error: "",
        createdProduct: "",
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
        createdProduct,
    } = values;
    // Using useRef instead of useState to avoid re-renders
    // as FormData does not affect the UI, only used when 
    // submitting to the API so should not cause re-render when updated.
    const formData = useRef<FormData>(new FormData())
    useEffect(() => {
        if (!productId) return;
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
                quantity: product.quantity.toString(),
            }));

            loadCategories();
        } catch {
            setValues((p) => ({ ...p, error: "Failed to load product" }));
        }
    };
    useEffect(() => {
        return () => {
            if (imgPreview) {
                URL.revokeObjectURL(imgPreview)
            }
        }
    }, [imgPreview])

    const loadCategories = async () => {
        const res: ApiResponse<ICategory[]> = await getCategories();
        if (!res.error) {
            setValues((p) => ({ ...p, categories: res.data ?? [] }));
        }
    };

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
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setValues(p => ({ ...p, error: "File must be image" }))
            return;
        }

        formData.current.set("photo", file);
        setValues((p) => ({ ...p, photo: file }));
        setImgPreview(URL.createObjectURL(file))
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
                createdProduct: res.data?.name ?? "",
                loading: false
            }));


            navigate("/");
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

                    {createdProduct && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {createdProduct} updated successfully
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
                                onChange={handlePhotoFileChange}
                            />
                        </Button>
                        {productId && (
                            <img src={imgPreview || `${API}/product/photo/${productId}`}
                                style={{ width: 200 }} />
                        )}

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