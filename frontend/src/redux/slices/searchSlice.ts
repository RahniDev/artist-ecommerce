import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { getCategories, list } from "../../core/apiCore";
import type { ICategory, IProduct } from "../../types";

interface SearchState {
  categories: ICategory[];
  category: string;
  search: string;
  results: IProduct[];
  searched: boolean;
  loading: boolean;
  error?: string;
}

const initialState: SearchState = {
  categories: [],
  category: "",
  search: "",
  results: [],
  searched: false,
  loading: false,
};

export const fetchCategories = createAsyncThunk(
  "search/fetchCategories",
  async () => {
    const res = await getCategories();
    if (res.error) throw new Error(res.error);
    return res.data ?? [];
  }
);

export const fetchSearchResults = createAsyncThunk(
  "search/fetchSearchResults",
  async (
    params: { search: string; category: string },
    { rejectWithValue }
  ) => {
    const res = await list(params);
    if (res.error) return rejectWithValue(res.error);
    return Array.isArray(res.data) ? res.data : [];
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
      state.searched = false;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.searched = false;
    },
    resetSearch(state) {
      state.results = [];
      state.searched = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchSearchResults.pending, state => {
        state.loading = true;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.searched = true;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.results = [];
        state.searched = true;
        state.error = action.payload as string;
      });
  },
});

export const { setCategory, setSearch, resetSearch } = searchSlice.actions;
export default searchSlice.reducer;
