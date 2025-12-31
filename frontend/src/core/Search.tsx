import React, { useState, useEffect } from "react";
import { getCategories, list } from "./apiCore";
import Card from "./Card";
import type { SearchState, IProduct } from "../types";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Grid
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";

const Search: React.FC = () => {
  const [data, setData] = useState<SearchState>({
    categories: [],
    category: "",
    search: "",
    results: [],
    searched: false,
  });

  const { categories, category, search, results, searched } = data;

  const loadCategories = async () => {
    const result = await getCategories();

    if (result.error) {
      console.error(result.error);
      setData((prev) => ({
        ...prev,
        categories: [], // always array
      }));
      return;
    }

    // ✅ Ensure categories is ALWAYS an array
    setData((prev) => ({
      ...prev,
      categories: Array.isArray(result.data) ? result.data : [],
    }));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const searchData = async () => {
    if (!search) return;

    const res = await list({ search, category });

    if (res.error) {
      setData(prev => ({ ...prev, results: [], searched: true }));
      return;
    }

    const products = Array.isArray(res.data) ? res.data : [];
    setData(prev => ({ ...prev, results: products, searched: true }));
  };

  const searchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchData();
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setData(prev => ({
      ...prev,
      category: event.target.value,
      searched: false,
    }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData(prev => ({
      ...prev,
      search: event.target.value,
      searched: false,
    }));
  };


  const searchMessage = (searched: boolean, results: IProduct[]) => {
    if (!searched) return "";
    return results.length > 0
      ? `Found ${results.length} products`
      : "No products found";
  };

  const searchedProducts = (results: IProduct[]) => (
    <Grid container spacing={2}>
      <Grid size={12}>
        <h2>{searchMessage(searched, results)}</h2>
      </Grid>
      {results.map((product) => (
        <Grid size={4} key={product._id}>
          <Card product={product} />
        </Grid>
      ))}
    </Grid>
  )

  const searchForm = () => (
    <Box
      component="form"
      onSubmit={searchSubmit}
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        width: "100%",
      }}
    >
      <FormControl sx={{ minWidth: 160 }}>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          value={category}
          label="Category"
          onChange={handleCategoryChange}
        >
          <MenuItem value="">All</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c._id} value={c._id}>
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Search Input */}
      <TextField
        fullWidth
        type="search"
        label="Search products"
        value={search}
        onChange={handleSearchChange}
      />

      {/* Search Button */}
      <Button
        type="submit"
        variant="contained"
        size="large"
      >
        <SearchIcon />
      </Button>
    </Box>
  );

  return (
    <Grid container spacing={2}>
      <Grid size={4}>{searchForm()}</Grid>
      <Grid size={12}>{searchedProducts(results)}</Grid>
    </Grid>
  );
};

export default Search;
