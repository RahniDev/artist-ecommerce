import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { createCategory } from "./apiAdmin";
import type { AuthData, ApiResponse, Category } from "../types";
import {
  Box,
  Typography,
  Button,
  Link
} from "@mui/material";

const AddCategory: React.FC = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdCategory, setCreatedCategory] = useState<Category | null>(null);

  const { user, token } = isAuthenticated() as AuthData;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setName(e.target.value);
  };

  const clickSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const data = await createCategory(
        user._id,
        token,
        { name }
      ) as ApiResponse<Category>;

      if (data.error) {
        setError(data.error);
      } else if (data.data) {
        setCreatedCategory(data.data);
        setSuccess(true);
        setName("");
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
          gap: 2
        }}
      >
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={handleChange}
          autoFocus
          required
        />
        <Button type="submit" variant="contained">
          Create Category
        </Button>
      </Box>
    </form>
  );

  const showSuccess = () =>
    success && createdCategory && (
      <Typography color="success.main">
        {createdCategory.name} is created!
      </Typography>
    );

  const showError = () =>
    error && (
      <Typography color="error.main">
        {error}
      </Typography>
    );

  const goBack = () => (
    <Link href="/admin/dashboard">
      Back to Dashboard
    </Link>
  );

  return (
    <Layout title="" description="">
      <Typography variant="h1" gutterBottom>
        Add a new category
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