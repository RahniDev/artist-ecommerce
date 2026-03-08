import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { createCategory, getCategories } from "./apiAdmin";
import type { IAuthData, ApiResponse, Category } from "../types";
import {
  Box,
  Typography,
  Button,
  Link,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  type SelectChangeEvent,
} from "@mui/material";

const AddCategory = () => {
  const [name, setName] = useState<string>("");
  const [parentId, setParentId] = useState<string>("");
  const [topLevelCategories, setTopLevelCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [createdCategory, setCreatedCategory] = useState<Category | null>(null);

  const { user, token } = isAuthenticated() as IAuthData;

  // Load only top-level categories as parent options (no subcategories of subcategories)
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories() as ApiResponse<Category[]>;
        if (data.data) {
          // Only top-level categories (no parent) can be parents themselves
          const topLevel = data.data.filter((c) => !c.parent);
          setTopLevelCategories(topLevel);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    loadCategories();
  }, [success]); // Re-fetch after a successful creation

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setName(e.target.value);
  };

  const handleParentChange = (e: SelectChangeEvent<string>) => {
    setParentId(e.target.value);
  };

  const clickSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const payload: { name: string; parent?: string } = { name };
      if (parentId) payload.parent = parentId;

      const data = await createCategory(
        user._id,
        token,
        payload
      ) as ApiResponse<Category>;

      if (data.error) {
        setError(data.error);
      } else if (data.data) {
        setCreatedCategory(data.data);
        setSuccess(true);
        setName("");
        setParentId("");
      }
    } catch (err) {
      console.error("Category creation failed:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const newCategoryForm = () => (
    <form id="categoryForm" onSubmit={clickSubmit}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          maxWidth: 400,
          mx: "auto",
        }}
      >
        {/* Name field */}
        <Box sx={{ width: "100%" }}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={handleNameChange}
            required
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </Box>

        {/* Parent category selector */}
        <FormControl fullWidth>
          <InputLabel id="parent-label">
            Parent Category (leave blank for top-level)
          </InputLabel>
          <Select
            labelId="parent-label"
            id="parent"
            value={parentId}
            label="Parent Category (leave blank for top-level)"
            onChange={handleParentChange}
          >
            <MenuItem value="">
              <em>None — top-level category</em>
            </MenuItem>
            {topLevelCategories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained">
          Create Category
        </Button>
      </Box>
    </form>
  );

  const showSuccess = () =>
    success && createdCategory && (
      <Typography color="success.main">
        <strong>{createdCategory.name}</strong> created successfully
        {createdCategory.parent
          ? ` as a subcategory of ${(createdCategory.parent as Category).name}`
          : " as a top-level category"}
        !
      </Typography>
    );

  const showError = () =>
    error && (
      <Typography color="error.main">{error}</Typography>
    );

  const goBack = () => (
    <Link href="/admin/dashboard">Back to Dashboard</Link>
  );

  return (
    <Layout title="" description="">
      <Typography variant="h1" gutterBottom>
        Add a new collection
      </Typography>
      <Box>
        {goBack()}
        {showSuccess()}
        {showError()}
        {newCategoryForm()}
      </Box>
    </Layout>
  );
};

export default AddCategory;