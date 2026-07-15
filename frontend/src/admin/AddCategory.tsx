import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link as RouterLink } from 'react-router-dom';
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { createCategory, getCategories } from "./apiAdmin";
import type { IAuthData, Category } from "../types";
import {
  Box,
  Typography,
  Button,
  TextField,
  Link,
  Alert,
  MenuItem,
} from "@mui/material";

const AddCategory = () => {
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [createdCategory, setCreatedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [parent, setParent] = useState("");

  const { user, token } = isAuthenticated() as IAuthData;

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setCreatedCategory(null);
    setName(e.target.value);
  };
  useEffect(() => {
    loadCategories();
  }, []);


  const loadCategories = async () => {
    const response = await getCategories();

    if (response.error) {
      setError(response.error);
      return;
    }

    setCategories(response.data ?? []);
  };

  const handleParentChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setParent(e.target.value);
  };

  const clickSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setParent("");

    try {
      const payload = {
        name,
        parent: parent || null,
      };

      const data = await createCategory(
        user._id,
        token,
        payload
      );
      if (data.error) {
        setError(data.error);
      } else {
        setCreatedCategory(data as Category);
        setName("");
      }
    } catch (err) {
      console.error("Error creating the collection:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const getLabel = (category: Category) => {
    if (category.level === 1) return category.name;

    if (category.level === 2) {
      return `-- ${category.name}`;
    }

    return `---- ${category.name}`;
  };
  return (
    <Layout title="" description="">
      <Link component={RouterLink} to="/admin/dashboard">Back to Dashboard</Link>
      <Typography variant="h1" gutterBottom sx={{
        pt: { xs: 3, sm: 0 },
      }}>
        Add a new collection
      </Typography>
      <form onSubmit={clickSubmit}>
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
          <TextField
            select
            label="Parent Category"
            value={parent}
            onChange={handleParentChange}
            fullWidth
          >
            <MenuItem value="">
              No parent (Top level category)
            </MenuItem>

            {categories.map((category) => (
              <MenuItem
                key={category._id}
                value={category._id}
                disabled={category.level === 3}
              >
                {getLabel(category)}
              </MenuItem>
            ))}
          </TextField>
          {/* Name field */}
          <TextField
            label="Collection Name"
            value={name}
            onChange={handleNameChange}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Creating..." : "Add Collection"}
          </Button>
        </Box>
      </form>
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>
      )}
      {createdCategory && (
        <Alert severity="success" sx={{ mt: 3 }}>
          <strong>{createdCategory.name}</strong> created successfully!
        </Alert>)}
    </Layout>
  );
};

export default AddCategory;