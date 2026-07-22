import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCategories } from "../../core/apiCore";
import type { Category } from "../../types";

type CategoriesState = {
  items: Category[];
  loading: boolean;
  error: string | null;
  loaded: boolean;
};

const initialState: CategoriesState = {
  items: [],
  loading: false,
  error: null,
  loaded: false,
};

export const fetchCategories = createAsyncThunk(
    "categories/fetchCategories",
    async (_, { rejectWithValue }) => {
        try {
            return await getCategories()
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Failed to load categories")
        }
    }
)

const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.loaded = true;
                // handle ApiResponse<Category[]> or raw Category[]
                const payload: any = action.payload;
                if (Array.isArray(payload)) {
                    state.items = payload;
                } else if (Array.isArray(payload?.data)) {
                    state.items = payload.data;
                } else if (Array.isArray(payload?.result)) {
                    state.items = payload.result;
                } else {
                    state.items = [];
                }
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    typeof action.payload === "string"
                        ? action.payload
                        : "Failed to load categories";
            });
    },
});

export default categoriesSlice.reducer;