import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FavouriteApi from "api/favourite";

const initialState = {
  favourites: [],
  loading: true,
};

export const fetchFavourites = createAsyncThunk(
  "favourite/fetchFavourites",
  async (userId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const data = await FavouriteApi.get(userId);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createFavourite = createAsyncThunk(
  "favourite/createFavourite",
  async (favourite, { rejectWithValue, fulfillWithValue }) => {
    try {
      const data = await FavouriteApi.post(favourite);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteFavourite = createAsyncThunk(
  "favourite/deleteFavourite",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      await FavouriteApi.remove(id);
      return fulfillWithValue(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const favouriteSlice = createSlice({
  name: "favourite",
  initialState,
  reducers: {},
  extraReducers: {
    // handle fetch colors
    [fetchFavourites.pending]: (state) => {
      state.loading = true;
    },
    [fetchFavourites.rejected]: (state, action) => {
      state.loading = false;
    },
    [fetchFavourites.fulfilled]: (state, action) => {
      const { favourites } = action.payload;
      state.loading = false;
      state.favourites = favourites;
    },

    // handle create favourite
    [createFavourite.pending]: (state) => {
      state.loading = true;
    },
    [createFavourite.rejected]: (state, action) => {
      state.loading = false;
    },
    [createFavourite.fulfilled]: (state, action) => {
      const { newFavourite } = action.payload;
      state.loading = false;
      state.favourites.push(newFavourite);
    },

    // handle delete favourite
    [deleteFavourite.pending]: (state) => {
      state.loading = true;
    },
    [deleteFavourite.rejected]: (state) => {
      state.loading = false;
    },
    [deleteFavourite.fulfilled]: (state, action) => {
      state.loading = false;
      state.favourites = state.favourites.filter(
        (favourite) => favourite._id !== action.payload
      );
    },
  },
});

const { reducer } = favouriteSlice;
export default reducer;
