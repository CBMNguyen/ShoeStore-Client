import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import sizeApi from "api/size";

const initialState = {
  size: [],
  error: "",
  loading: true,
};

export const fetchSize = createAsyncThunk(
  "size/fetchSize",
  async (NULL, { rejectWithValue, fulfillWithValue }) => {
    try {
      const size = await sizeApi.getAll();
      return fulfillWithValue(size);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const sizeSlice = createSlice({
  name: "size",
  initialState,
  reducers: {},
  extraReducers: {
    // handle fetch sizes
    [fetchSize.pending]: (state) => {
      state.loading = true;
    },
    [fetchSize.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [fetchSize.fulfilled]: (state, action) => {
      const { sizes } = action.payload;
      state.loading = false;
      state.size = sizes;
    },
  },
});

const { reducer } = sizeSlice;

export default reducer;
