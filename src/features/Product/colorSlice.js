import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import colorApi from "api/color";

const initialState = {
  color: [],
  error: "",
  loading: true,
};

export const fetchColor = createAsyncThunk(
  "color/fetchColor",
  async (NULL, { rejectWithValue, fulfillWithValue }) => {
    try {
      const color = await colorApi.getAll();
      return fulfillWithValue(color);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const colorSlice = createSlice({
  name: "color",
  initialState,
  reducers: {},
  extraReducers: {
    // handle fetch colors
    [fetchColor.pending]: (state) => {
      state.loading = true;
    },
    [fetchColor.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [fetchColor.fulfilled]: (state, action) => {
      const { colors } = action.payload;
      state.loading = false;
      state.color = colors;
    },
  },
});

const { reducer } = colorSlice;

export default reducer;
