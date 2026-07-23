import {
  useEffect, useMemo, useRef, useState,
  type ChangeEvent, type FormEvent
} from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { createProduct, getCategories } from "./apiAdmin";
import type {
  AddProductValues,
  Category,
  ProductFormField,
} from "../types";
import Loader from "../core/Loader";
import ProductImage from "../core/ShowImage";
import Layout from "../core/Layout";
import { PAINTING_SIZES, MEDIUM_OPTIONS, MATERIAL_OPTIONS, FRAMING_OPTIONS } from "../constants/productOptions";

type CategoryWithSubcategories = Category & {
  parent?: string | null;
  level?: number;
  subcategories?: CategoryWithSubcategories[];
};

const AddProduct: React.FC = () => {
  const navigate = useNavigate();

  const auth = useSelector((state: RootState) => state.auth);
  const { user, token, isAuthenticated } = auth;

  const [imgPreviews, setImgPreviews] = useState<string[]>([]);
  const [parentCategory, setParentCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const [values, setValues] = useState<AddProductValues>({
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
    createdProduct: false,
    createdProductName: "",
    createdProductId: "",
    framing: "",
    additionalDetails: "",
    material: "",
    medium: "",
  });

  const {
    name,
    price,
    size,
    categories,
    loading,
    error,
    createdProduct,
    framing,
    additionalDetails,
    medium,
    material,
  } = values;

  const formData = useRef<FormData | null>(null);

  const selectedParentCategory = useMemo(() => {
    return (categories as CategoryWithSubcategories[]).find(
      (item) => item._id === parentCategory
    );
  }, [categories, parentCategory]);

  const subcategories = selectedParentCategory?.subcategories ?? [];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const init = async () => {
      formData.current = new FormData();

      const response = await getCategories();

      if (response.error) {
        setValues((previous) => ({
          ...previous,
          error: response.error || "",
        }));

        return;
      }

      setValues((previous) => ({
        ...previous,
        categories: response.data || [],
      }));
    };

    init();
  }, []);

  useEffect(() => {
    return () => {
      imgPreviews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [imgPreviews]);

  const handleInputChange =
    (field: ProductFormField) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!formData.current) {
          return;
        }

        if (
          field === "photo" &&
          event.target instanceof HTMLInputElement &&
          event.target.files
        ) {
          const files = Array.from(event.target.files);

          formData.current.delete("photos");

          imgPreviews.forEach((preview) => {
            URL.revokeObjectURL(preview);
          });

          if (files.length > 0) {
            files.forEach((file) => {
              formData.current?.append("photos", file);
            });

            setValues((previous) => ({
              ...previous,
              photos: files,
            }));

            setImgPreviews(
              files.map((file) => URL.createObjectURL(file))
            );
          } else {
            setValues((previous) => ({
              ...previous,
              photos: [],
            }));

            setImgPreviews([]);
          }

          return;
        }

        const value = event.target.value;

        formData.current.set(field, value);

        setValues((previous) => ({
          ...previous,
          [field]: value,
        }));
      };

  const handleSelectChange =
    (field: ProductFormField) =>
      (event: SelectChangeEvent<string>) => {
        if (!formData.current) {
          return;
        }

        const value = event.target.value;

        formData.current.set(field, value);

        setValues((previous) => ({
          ...previous,
          [field]: value,
        }));
      };

  const handleParentCategoryChange = (
    event: SelectChangeEvent<string>
  ) => {
    const parentCategoryId = event.target.value;

    setParentCategory(parentCategoryId);
    setSelectedSubcategory("");

    if (parentCategoryId) {
      formData.current?.set("category", parentCategoryId);
    } else {
      formData.current?.delete("category");
    }

    setValues((previous) => ({
      ...previous,
      category: parentCategoryId,
    }));
  };

  const handleSubcategoryChange = (
    event: SelectChangeEvent<string>
  ) => {
    if (!formData.current) {
      return;
    }

    const subcategoryId = event.target.value;
    const finalCategoryId = subcategoryId || parentCategory;

    setSelectedSubcategory(subcategoryId);

    if (finalCategoryId) {
      formData.current.set("category", finalCategoryId);
    } else {
      formData.current.delete("category");
    }

    setValues((previous) => ({
      ...previous,
      category: finalCategoryId,
    }));
  };

  const resetForm = () => {
    imgPreviews.forEach((preview) => {
      URL.revokeObjectURL(preview);
    });

    setParentCategory("");
    setSelectedSubcategory("");
    setImgPreviews([]);
    formData.current = new FormData();

    setValues((previous) => ({
      ...previous,
      name: "",
      price: "",
      size: "",
      category: "",
      weight: "",
      width: "",
      height: "",
      length: "",
      photos: [],
      additionalDetails: "",
      material: "",
      medium: "",
      framing: "",
    }));
  };

  const clickSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!formData.current || !user || !token) {
      return;
    }

    if (!parentCategory) {
      setValues((previous) => ({
        ...previous,
        error: "Please select a category.",
      }));

      return;
    }

    setValues((previous) => ({
      ...previous,
      loading: true,
      error: "",
      createdProduct: false,
      createdProductName: "",
    }));

    try {
      const response = await createProduct(
        user._id,
        token,
        formData.current
      );

      const rawName = response.data?.name as
        | string
        | { en?: string }
        | undefined;

      if (response.error) {
        setValues((previous) => ({
          ...previous,
          error: response.error || "",
          loading: false,
        }));

        return;
      }

      if (response.data) {
        const createdProductName =
          typeof rawName === "object"
            ? rawName?.en || ""
            : rawName || "";

        setValues((previous) => ({
          ...previous,
          createdProduct: true,
          createdProductName,
          createdProductId: response.data?._id || "",
        }));

        resetForm();
      }
    } catch (err) {
      console.error(err);

      setValues((previous) => ({
        ...previous,
        error: "Product creation failed",
        createdProduct: false,
      }));
    } finally {
      setValues((previous) => ({
        ...previous,
        loading: false,
      }));
    }
  };

  return (
    <Layout
      title="Add a new painting"
      description={`Hello ${user?.name || ""
        }, ready to add a new painting?`}
    >
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Loader loading={loading} />

          {createdProduct && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Link to={`/product/${values.createdProductId}`}>
                {values.createdProductName} is created!
              </Link>
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
            <Typography variant="h6">
              Painting Photo
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                flexWrap: "wrap",
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

              {imgPreviews.map((preview) => (
                <ProductImage
                  key={preview}
                  item={{
                    _id: "",
                    photos: [{ url: preview }],
                  }}
                  url="product"
                  sizes="(max-width: 600px) 100vw, 33vw"
                  width={200}
                  height={200}
                />
              ))}
            </Box>

            <TextField
              label="Title"
              value={name}
              onChange={handleInputChange("name")}
              required
              fullWidth
            />

            <TextField
              label="Price"
              type="number"
              value={price}
              onChange={handleInputChange("price")}
              required
              fullWidth
            />

            <FormControl fullWidth required>
              <InputLabel id="parent-category-label">
                Category
              </InputLabel>

              <Select
                labelId="parent-category-label"
                value={parentCategory}
                label="Category"
                onChange={handleParentCategoryChange}
              >
                <MenuItem value="">
                  <em>Please select a category</em>
                </MenuItem>

                {(categories as CategoryWithSubcategories[]).map(
                  (parent) => (
                    <MenuItem
                      key={parent._id}
                      value={parent._id}
                    >
                      {parent.name}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              disabled={!parentCategory || subcategories.length === 0}
            >
              <InputLabel id="subcategory-label">
                Subcategory (optional)
              </InputLabel>

              <Select
                labelId="subcategory-label"
                value={selectedSubcategory}
                label="Subcategory (optional)"
                onChange={handleSubcategoryChange}
              >
                <MenuItem value="">
                  <em>
                    {!parentCategory
                      ? "Select a category first"
                      : subcategories.length === 0
                        ? "No subcategories available"
                        : "No subcategory"}
                  </em>
                </MenuItem>

                {subcategories.map((subcategory: any) => (
                  <MenuItem
                    key={subcategory._id}
                    value={subcategory._id}
                  >
                    {subcategory.name}
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
                {MATERIAL_OPTIONS.map((material) => (
                  <MenuItem key={material} value={material}>
                    {material}
                  </MenuItem>
                ))}</Select>
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
                {MEDIUM_OPTIONS.map((paintingMedium) => (
                  <MenuItem key={paintingMedium} value={paintingMedium}>
                    {paintingMedium}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Size</InputLabel>
              <Select
                value={size}
                label="Size"
                onChange={handleSelectChange("size")}
              >
                <MenuItem value="">
                  <em>Please select</em>
                </MenuItem>

                {PAINTING_SIZES.map((paintingSize) => (
                  <MenuItem key={paintingSize} value={paintingSize}>
                    {paintingSize}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
                {FRAMING_OPTIONS.map((framing) => (
                  <MenuItem key={framing} value={framing}>
                    {framing}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Additional Details e.g. painting scuffed on the bottom left"
              value={additionalDetails}
              onChange={handleInputChange(
                "additionalDetails"
              )}
              multiline
              rows={4}
              fullWidth
            />

            <Typography>
              Only required for shipping:
            </Typography>

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
              disabled={loading || !parentCategory}
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