import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link as RouterLink } from 'react-router-dom';
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { createCategory } from "./apiAdmin";
import type { IAuthData, Category } from "../types";
import {
  Box,
  Typography,
  Button,
  TextField,
  Link,
  Alert
} from "@mui/material";

const AddCategory = () => {
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [createdCategory, setCreatedCategory] = useState<Category | null>(null);

  const { user, token } = isAuthenticated() as IAuthData;

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setCreatedCategory(null);
    setName(e.target.value);
  };

  const clickSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = { name };

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

  return (
    <Layout title="" description="">
      <Link component={RouterLink} to="/admin/dashboard">Back to Dashboard</Link>
      <Typography variant="h1" gutterBottom>
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