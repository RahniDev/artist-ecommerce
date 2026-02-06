import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import {
  fetchCategories,
  fetchSearchResults,
  setCategory,
  setSearch,
} from "../redux/slices/searchSlice";

import Card from "./ProductCard";
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
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "react-i18next";

const Search: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const {
    categories,
    category,
    search,
    results,
    searched,
    // loading
  } = useSelector((state: RootState) => state.search);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const searchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) return;
    dispatch(fetchSearchResults({ search, category }));
  };

  const searchMessage = () => {
    if (!searched) return "";
    return results.length > 0
      ? t("found_products", { count: results.length })
      : t("no_products");
  };

  return (
    <Grid container spacing={2}>
      {/* Search form */}
      <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
        <Box
          component="form"
          onSubmit={searchSubmit}
          sx={{
            display: "flex",
            gap: 1,
            mt: 4,
            flexWrap: "wrap",
          }}
        >
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>{t("category")}</InputLabel>
            <Select
              value={category}
              onChange={(e: SelectChangeEvent) =>
                dispatch(setCategory(e.target.value))
              }
            >
              <MenuItem value="">All</MenuItem>
              {categories.map(c => (
                <MenuItem key={c._id} value={c._id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label={t("search")}
            value={search}
            onChange={e => dispatch(setSearch(e.target.value))}
            sx={{ minWidth: 250 }}
          />

          <Button type="submit" variant="contained">
            <SearchIcon />
          </Button>
        </Box>
      </Grid>

      {/* Results */}
      <Grid size={12}>
        {searched && (
          <Typography variant="h6" align="center">
            {searchMessage()}
          </Typography>
        )}

        <Grid container spacing={2} mt={2}>
          {results.map(product => (
            <Grid size={4} key={product._id}>
              <Card product={product} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Search;
