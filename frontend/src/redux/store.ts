import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice.ts';
import productReducer from './slices/productSlice.ts';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    product: productReducer
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
