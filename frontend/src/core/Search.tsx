import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import {
  fetchSearchResults,
  setSearch,
  resetSearch,
} from "../redux/slices/searchSlice";
import { fetchCategories } from "../redux/slices/categorySlice";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  TextField,
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

  useEffect(() => {
    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      dispatch(resetSearch());
      return;
    }

    const timer = setTimeout(() => {
      dispatch(fetchSearchResults({ search: trimmedSearch, category }));
    }, 500);

    return () => clearTimeout(timer);
  }, [search, category, dispatch]);

  const searchMessage = () => {
    if (!searched) return "";
    return results.length > 0
      ? t("found_products", { count: results.length })
      : t("no_products");
  };

  return (
    <>
      <Box
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
          onChange={(e) => dispatch(setSearch(e.target.value))}
          slotProps={{
            input: {
              endAdornment: <SearchIcon />,
            },
          }}
        />
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