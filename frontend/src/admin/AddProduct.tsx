import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from "react";
import Layout from "../core/Layout";
import { createProduct, getCategories } from "./apiAdmin";
import type { AddProductValues, ProductFormField } from "../types";
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
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";

const AddProduct: React.FC = () => {
  const navigate = useNavigate();

  // Get auth from Redux
  const auth = useSelector((state: RootState) => state.auth);
  const { user, token, isAuthenticated } = auth;
  const [imgPreview, setImgPreview] = useState("");
  const [values, setValues] = useState<AddProductValues>({
    name: "",
    description: "",
    price: "",
    categories: [],
    category: "",
    shipping: "",
    quantity: "",
    photo: "",
    loading: false,
    error: "",
    createdProduct: false,
    createdProductName: ""
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
    createdProduct
  } = values;

  const formData = useRef<FormData | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) navigate("/signin");
  }, [isAuthenticated, navigate]);

  // Load categories
  useEffect(() => {
    const init = async () => {
      const data = await getCategories();
      if (data.error) {
        setValues((p) => ({ ...p, error: data.error || "" }));
      } else {
        setValues((p) => ({
          ...p,
          categories: data.data || []
        }));
        formData.current = new FormData()
      }
    };

    init();
  }, []);

  const handleInputChange =
    (field: ProductFormField) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!formData.current) return;

        if (field === "photo" && event.target instanceof HTMLInputElement) {
          const file = event.target.files?.[0];
          if (file) {
            formData.current.set("photo", file);

            setValues((prev) => ({
              ...prev,
              photo: file
            }));

            const previewUrl = URL.createObjectURL(file);
            setImgPreview(previewUrl);
          }
        } else {
          const value = event.target.value;
          formData.current.set(field, value);
          setValues((prev) => ({ ...prev, [field]: value }));
        }
      };

  const handleSelectChange =
    (field: ProductFormField) =>
      (event: SelectChangeEvent<string>) => {
        if (!formData.current) return;
        const value = event.target.value;
        formData.current.set(field, value);
        setValues((prev) => ({ ...prev, [field]: value }));
      };

  const clickSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.current || !user || !token) return;

    setValues((prev) => ({
      ...prev,
      loading: true,
      error: "",
      createdProduct: false,
      createdProductName: "",
    }));

    try {
      const res = await createProduct(user._id, token, formData.current);

      if (res.error) {
        setValues((p) => ({
          ...p,
          error: res.error || "",
          loading: false,
        }));
      } else if (res.data) {
        const product = res.data
        setValues((p) => ({
          ...p,
          createdProduct: true,
          createdProductName: product.name,

          name: "",
          description: "",
          price: "",
          quantity: "",
          photo: "",
        }));
      }
    } catch {
      setValues((p) => ({
        ...p,
        error: "Product creation failed",
        createdProduct: false
      }));
    }
    finally {
      setValues((p) => ({
        ...p,
        loading: false
      }))
    }
  };

  return (
    <Layout
      title="Add a new product"
      description={`Hello ${user?.name || ""}, ready to add a new product?`}
    >
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Loader loading={loading} />

          {createdProduct && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {values.createdProductName} is created!
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
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
            <Typography variant="h6">Product Photo</Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                gap: 2,
              }}
            >
              <Button variant="outlined" component="label">
                Upload Image
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange("photo")}
                />
              </Button>

              {imgPreview && (
                <Box
                  component="img"
                  src={imgPreview}
                  alt="Product photo preview"
                  sx={{
                    width: 200,
                    borderRadius: 1,
                    border: "1px solid #ddd",
                  }}
                />
              )}
            </Box>
            <TextField
              label="Name"
              value={name}
              onChange={handleInputChange("name")}
              fullWidth
            />

            <TextField
              label="Product Description"
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
            />

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={handleSelectChange("category")}
              >
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
              <InputLabel>Shipping</InputLabel>
              <Select
                value={shipping}
                label="Shipping"
                onChange={handleSelectChange("shipping")}
              >
                <MenuItem value="">
                  <em>Please select</em>
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

            <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }} disabled={loading}>
              Create Product
            </Button>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default AddProduct;