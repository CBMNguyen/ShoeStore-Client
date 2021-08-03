import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productApi from "api/product";

const initialState = {
  products: [],
  error: "",
  loading: false,
};

export const fetchProduct = createAsyncThunk(
  "product/fetchProduct",
  async (NULL, { rejectWithValue, fulfillWithValue }) => {
    try {
      const products = await productApi.getAll();
      return fulfillWithValue(products);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: {
    // handle fetch products
    [fetchProduct.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [fetchProduct.fulfilled]: (state, action) => {
      const { products } = action.payload;
      state.loading = false;
      state.products = products;
      state.error = "";
    },
  },
});

const { reducer } = productSlice;
export default reducer;
