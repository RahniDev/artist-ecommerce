import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import {
  fetchCategories,
  fetchSearchResults,
  setSearch,
} from "../redux/slices/searchSlice";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import ProductCard from "./ProductCard";

const Search = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const {
    category,
    search,
    results,
    searched,
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
    <>
      <Box
        component="form"
        onSubmit={searchSubmit}
        sx={{
          display: "flex",
          flexWrap: "nowrap",
          mb: 6,
          pt: 5
        }}
      >

        <TextField
          size="small"
          label={t("search")}
          value={search}
          onChange={e => dispatch(setSearch(e.target.value))}
          sx={{
            minWidth: 190,
            "& .MuiOutlinedInput-root": {
              borderRadius: 0,
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{
            minWidth: 48,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            boxShadow: "none",
          }}
        >
          <SearchIcon />
        </Button>
      </Box>
      <Box>
        <Typography variant="h6" aria-live="polite"
          sx={{ textAlign: "center", mt: 3 }}
          aria-atomic="true">
          {searchMessage()}</Typography>
        <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2, mt: 3 }}>
          {results.map(product => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </Box>
      </Box>
    </>
  );
};

export default Search;