import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from "react";
import Layout from "../core/Layout";
import { createProduct, getCategories } from "./apiAdmin";
import type { AddProductValues, ProductFormField, Category } from "../types";
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
  const auth = useSelector((state: RootState) => state.auth);
  const { user, token, isAuthenticated } = auth;

  const [imgPreview, setImgPreview] = useState("");
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [values, setValues] = useState<AddProductValues>({
    name: "",
    description: "",
    price: "",
    weight: "",
    width: "",
    height: "",
    length: "",
    categories: [],
    category: "",
    subcategory: "",
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
    subcategory,
    weight,
    width,
    height,
    length,
    shipping,
    quantity,
    loading,
    error,
    createdProduct
  } = values;

  const formData = useRef<FormData | null>(null);

  useEffect(() => {
    if (!isAuthenticated) navigate("/signin");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const init = async () => {
      const data = await getCategories();
      if (data.error) {
        setValues(p => ({ ...p, error: data.error || "" }));
      } else {
        setValues(p => ({ ...p, categories: data.data || [] }));
        formData.current = new FormData();
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
            setValues(prev => ({ ...prev, photo: file }));
            setImgPreview(URL.createObjectURL(file));
          }
        } else {
          const value = event.target.value;
          formData.current.set(field, value);
          setValues(prev => ({ ...prev, [field]: value }));
        }
      };

  const handleSelectChange =
    (field: ProductFormField) =>
      (event: SelectChangeEvent<string>) => {
        if (!formData.current) return;
        const value = event.target.value;
        formData.current.set(field, value);
        setValues(prev => ({ ...prev, [field]: value }));
      };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    if (!formData.current) return;
    const value = event.target.value;
    formData.current.set("category", value);
    formData.current.delete("subcategory");

    const subs = categories.filter(c =>
      c.parent && (typeof c.parent === "object" ? c.parent._id === value : c.parent === value)
    );

    setSubcategories(subs);
    setValues(prev => ({ ...prev, category: value, subcategory: "" }));
  };

  const handleSubcategoryChange = (event: SelectChangeEvent<string>) => {
    if (!formData.current) return;
    const value = event.target.value;
    if (value) {
      formData.current.set("subcategory", value);
    } else {
      formData.current.delete("subcategory");
    }
    setValues(prev => ({ ...prev, subcategory: value }));
  };

  const clickSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.current || !user || !token) return;

    setValues(prev => ({
      ...prev,
      loading: true,
      error: "",
      createdProduct: false,
      createdProductName: "",
    }));

    try {
      const res = await createProduct(user._id, token, formData.current);

      if (res.error) {
        setValues(p => ({ ...p, error: res.error || "", loading: false }));
      } else if (res.data) {
        setValues(p => ({
          ...p,
          createdProduct: true,
          createdProductName: res.data?.name,
          name: "",
          description: "",
          price: "",
          category: "",
          subcategory: "",
          weight: "",
          width: "",
          height: "",
          length: "",
          shipping: "",
          quantity: "",
          photo: "",
        }));
        setSubcategories([]);
        setImgPreview("");
        formData.current = new FormData();
      }
    } catch {
      setValues(p => ({ ...p, error: "Product creation failed", createdProduct: false }));
    } finally {
      setValues(p => ({ ...p, loading: false }));
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
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
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
                  sx={{ width: 200, borderRadius: 1, border: "1px solid #ddd" }}
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

            {/* Category — top-level only */}
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={category} label="Category" onChange={handleCategoryChange}>
                <MenuItem value=""><em>Please select</em></MenuItem>
                {categories
                  .filter(c => !c.parent)
                  .map(c => (
                    <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                  ))}
              </Select>
            </FormControl>

            {/* Subcategory */}
            {subcategories.length > 0 && (
              <FormControl fullWidth>
                <InputLabel>Subcategory</InputLabel>
                <Select
                  value={subcategory}
                  label="Subcategory"
                  onChange={handleSubcategoryChange}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {subcategories.map(sub => (
                    <MenuItem key={sub._id} value={sub._id}>{sub.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
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

            <FormControl fullWidth>
              <InputLabel>Shipping</InputLabel>
              <Select value={shipping} label="Shipping" onChange={handleSelectChange("shipping")}>
                <MenuItem value=""><em>Please select</em></MenuItem>
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
              Create Product
            </Button>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default AddProduct;