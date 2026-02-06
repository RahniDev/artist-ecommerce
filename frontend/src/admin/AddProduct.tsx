import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
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
    createdProduct: "",
    formData: null,
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
    formData,
  } = values;

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
          categories: data.data || [],
          formData: new FormData(),
        }));
      }
    };

    init();
  }, []);

  const handleInputChange =
    (field: ProductFormField) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!formData) return;

      if (field === "photo" && event.target instanceof HTMLInputElement) {
        const file = event.target.files?.[0];
        if (file) {
          formData.set("photo", file);
          setValues((prev) => ({ ...prev, photo: file }));
        }
      } else {
        const value = event.target.value;
        formData.set(field, value);
        setValues((prev) => ({ ...prev, [field]: value }));
      }
    };

  const handleSelectChange =
    (field: ProductFormField) =>
    (event: SelectChangeEvent<string>) => {
      if (!formData) return;
      const value = event.target.value;
      formData.set(field, value);
      setValues((prev) => ({ ...prev, [field]: value }));
    };

  const clickSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData || !user || !token) return;

    setValues((p) => ({ ...p, loading: true, error: "" }));

    try {
      const data = await createProduct(user._id, token, formData);

      if (data.error) {
        setValues((p) => ({
          ...p,
          error: data.error || "",
          loading: false,
        }));
      } else if (data.data) {
        setValues((p) => ({
          ...p,
          name: "",
          description: "",
          price: "",
          quantity: "",
          photo: "",
          loading: false,
          createdProduct: data.data.name,
          formData: new FormData(),
        }));
      }
    } catch {
      setValues((p) => ({
        ...p,
        error: "Product creation failed",
        loading: false,
      }));
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
              {createdProduct} is created!
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
            <Typography variant="h6">Post Photo</Typography>

            <Button variant="outlined" component="label">
              Upload Image
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleInputChange("photo")}
              />
            </Button>

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

            <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>
              Create Product
            </Button>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default AddProduct;