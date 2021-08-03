import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import categoryApi from "api/category";

const initialState = {
  category: [],
  error: "",
  loading: true,
};

export const fetchCategory = createAsyncThunk(
  "category/fetchCategory",
  async (NULL, { rejectWithValue, fulfillWithValue }) => {
    try {
      const categories = await categoryApi.getAll();
      return fulfillWithValue(categories);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: {
    // handle fetch categories
    [fetchCategory.pending]: (state) => {
      state.loading = true;
    },
    [fetchCategory.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [fetchCategory.fulfilled]: (state, action) => {
      const { categories } = action.payload;
      state.loading = false;
      state.category = categories;
    },
  },
});

const { reducer } = categorySlice;

export default reducer;
