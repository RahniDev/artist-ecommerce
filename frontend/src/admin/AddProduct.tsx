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
import { useNavigate, Link } from "react-router-dom";
import { PAINT_COLOR_OPTIONS } from "../../../shared/colourPalette";

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const { user, token, isAuthenticated } = auth;

  const [imgPreviews, setImgPreviews] = useState<string[]>([]);
  const [values, setValues] = useState<AddProductValues>({
    name: "",
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
    createdProduct: false,
    createdProductName: "",
    createdProductId: "",
    framing: "",
    additionalDetails: "",
    material: "",
    medium: "",
    colors: [],
    quality: ""
  });

  const {
    name,
    price,
    categories,
    category,
    loading,
    error,
    createdProduct,
    framing,
    additionalDetails,
    quality,
    medium,
    colors,
    material
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

          // Clear any previously selected photos from FormData
          formData.current.delete("photos");

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

  const handleColorToggle = (hex: string) => {
    if (!formData.current) return;

    const updatedColors = colors.includes(hex)
      ? colors.filter(c => c !== hex)
      : [...colors, hex];

    formData.current.delete("colors");
    updatedColors.forEach(c => formData.current!.append("colors", c));

    setValues(prev => ({
      ...prev,
      colors: updatedColors,
    }));
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    if (!formData.current) return;
    const value = event.target.value;
    formData.current.set("category", value);

    setValues(prev => ({ ...prev, category: value }));
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
          createdProductName: typeof rawName === "object" ? rawName?.en : rawName ?? "",
          createdProductId: res.data?._id ?? "",
          name: "",
          price: "",
          category: "",
          weight: "",
          width: "",
          height: "",
          length: "",
          photos: [],
          additionalDetails: "",
          quality: "",
          material: "",
          medium: "",
          colors: [],
          framing: ""
        }));
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
              <Link to={`/product/${values.createdProductId}`}>{values.createdProductName} is created!</Link>
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
                  multiple
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
              label="Price"
              type="number"
              value={price}
              onChange={handleInputChange("price")}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={category} label="Category" onChange={handleCategoryChange}>
                <MenuItem value="">
                  <em>Please select</em>
                </MenuItem>
                {categories.map(c => (
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
                    .filter(c => colors.includes(c.hex))
                    .map(c => c.name)
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
              Add Painting
            </Button>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default AddProduct;