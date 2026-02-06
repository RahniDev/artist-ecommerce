import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IProduct } from "../../types";
import { read, listRelated } from "../../core/apiCore";

interface ProductState {
  product: IProduct | null;
  related: IProduct[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  product: null,
  related: [],
  loading: false,
  error: null,
};

// async thunk: fetch single product + related
export const fetchProduct = createAsyncThunk(
  "product/fetchProduct",
  async (productId: string, { rejectWithValue }) => {
    const productRes = await read(productId);

    if (productRes.error || !productRes.data) {
      return rejectWithValue(productRes.error || "Failed to load product");
    }

    const relatedRes = await listRelated(productId);

    return {
      product: productRes.data,
      related: relatedRes.data?.data ?? [],
    };
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProduct(state) {
      state.product = null;
      state.related = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
        state.related = action.payload.related;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
