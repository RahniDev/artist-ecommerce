import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice.ts';
import productReducer from './slices/productSlice.ts';
import searchReducer from './slices/searchSlice.ts';
import authReducer from './slices/authSlice.ts';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    product: productReducer,
    search: searchReducer,
    auth: authReducer
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
