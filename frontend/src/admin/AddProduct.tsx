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

  const [imgPreviews, setImgPreviews] = useState<string[]>([]);
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
    quantity: "",
    photos: [],
    loading: false,
    error: "",
    createdProduct: false,
    createdProductName: "",
    framing: ""
  });

  const {
    name,
    description,
    price,
    categories,
    category,
    subcategory,
    quantity,
    loading,
    error,
    createdProduct,
    framing
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

        if (field === "photo" && event.target instanceof HTMLInputElement && event.target.files) {
          const files = Array.from(event.target.files);
          if (files.length > 0) {

            files.forEach((file) => formData.current!.append("photos", file));
            setValues(prev => ({ ...prev, photos: files }));
            setImgPreviews(files.map(file => URL.createObjectURL(file)));
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
      const rawName = res.data?.name as any;
      if (res.error) {
        setValues(p => ({ ...p, error: res.error || "", loading: false }));
      } else if (res.data) {
        setValues(p => ({
          ...p,
          createdProduct: true,
          createdProductName: typeof rawName === 'object' ? rawName?.en : rawName ?? "",
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
          photos: [],
        }));
        setSubcategories([]);
        setImgPreviews([]);
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
      title="Add a new painting"
      description={`Hello ${user?.name || ""}, ready to add a new painting?`}
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
            <Typography variant="h6">Painting Photo</Typography>
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
                  multiple={true}
                  accept="image/*"
                  onChange={handleInputChange("photo")}
                />
              </Button>

              {imgPreviews.map((src, i) => (
                <Box
                  key={i}
                  component="img"
                  src={src}
                  alt="Painting photo preview"
                  sx={{ width: 200, borderRadius: 1, border: "1px solid #ddd" }}
                />
              ))}
            </Box>

            <TextField
              label="Title"
              value={name}
              onChange={handleInputChange("name")}
              fullWidth
            />

            <TextField
              label="Painting Details: size, material, medium"
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
                onChange={handleSelectChange("framing")}>
                <MenuItem value="Unframed">Unframed</MenuItem>
                <MenuItem value="Ready to hang">Ready to hang</MenuItem>
              </Select>
            </FormControl>
            <Typography>Only required for shipping: </Typography>
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

            {/* <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={handleInputChange("quantity")}
              fullWidth
            /> */}

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              Add Painting
            </Button>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default AddProduct;