import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import {
  fetchCategories,
  fetchSearchResults,
  setCategory,
  setSearch,
} from "../redux/slices/searchSlice";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "react-i18next";

const Search = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const {
    categories,
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
    <Box
      component="form"
      onSubmit={searchSubmit}
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "nowrap",
        width: "100%",
      }}
    >
      <FormControl
        size="small"
        sx={{
          minWidth: 150,
          "& .MuiOutlinedInput-root": {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
      >
        <InputLabel>{t("category")}</InputLabel>
        <Select
          value={category}
          label={t("category")}
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
        size="small"
        label={t("search")}
        value={search}
        onChange={e => dispatch(setSearch(e.target.value))}
        sx={{
          flex: 1,
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
      <Typography variant="h6">{searchMessage()}</Typography>
    </Box>
  );
};

export default Search;