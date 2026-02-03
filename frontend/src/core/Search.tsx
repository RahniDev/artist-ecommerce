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
  Grid,
  Typography
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "react-i18next";

const Search: React.FC = () => {
  const [data, setData] = useState<SearchState>({
    categories: [],
    category: "",
    search: "",
    results: [],
    searched: false,
  });
  
  const { t } = useTranslation();

  const { categories, category, search, results, searched } = data;

  const loadCategories = async () => {
    const result = await getCategories();
    if (result.error) {
      console.error(result.error);
      setData(prev => ({ ...prev, categories: [] }));
      return;
    }
    setData(prev => ({ ...prev, categories: result.data ?? [] }));
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
    return results.length > 0 ? `${t("found_products", { count: results.length })}`
      : `${t("no_products")}`;
  };

  const searchedProducts = (results: IProduct[]) => (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {results.length > 0 && (
        <Grid size={12}>
          <Typography variant="h6" align="center">
            {searchMessage(searched, results)}
          </Typography>
        </Grid>
      )}
      {results.map(product => (
        <Grid size={4} key={product._id}>
          <Card product={product} />
        </Grid>
      ))}
    </Grid>
  );

  const searchForm = () => (
    <Box
      component="form"
      onSubmit={searchSubmit}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
        mt: 4,
        flexWrap: "wrap",
      }}
    >
      {/* Category dropdown */}
      <FormControl sx={{ minWidth: 160 }}>
        <InputLabel id="category-label">{t("category")}</InputLabel>
        <Select
          labelId="category-label"
          value={category}
          onChange={handleCategoryChange}
          size="medium"
        >
          <MenuItem value="">All</MenuItem>
          {categories.filter(c => c._id).map(c => (
            <MenuItem key={c._id} value={c._id}>
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Search input */}
      <TextField
        type="search"
        label={t("search")}
        value={search}
        onChange={handleSearchChange}
        sx={{
          minWidth: 250,
          flexGrow: 1,
        }}
        size="medium"
      />

      {/* Search button */}
      <Button
        type="submit"
        variant="contained"
        sx={{ height: 56, minWidth: 56 }}
      >
        <SearchIcon />
      </Button>
    </Box>
  );

  return (
    <Grid container spacing={2}>
      {/* Search form */}
      <Grid
        size={12}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        {searchForm()}
      </Grid>

      {/* Search results */}
      <Grid size={12}>{searchedProducts(results)}</Grid>
    </Grid>
  );
};

export default Search;
