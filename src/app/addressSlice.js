import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import addressApi from "api/address";

const initialState = {
  addresses: [],
  loading: true,
};

export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (userId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const data = await addressApi.get(userId);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createAddress = createAsyncThunk(
  "address/createAddress",
  async (address, { rejectWithValue, fulfillWithValue }) => {
    try {
      const data = await addressApi.post(address);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      await addressApi.remove(id);
      return fulfillWithValue(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: {
    // handle fetch addresses
    [fetchAddresses.pending]: (state) => {
      state.loading = true;
    },
    [fetchAddresses.rejected]: (state, action) => {
      state.loading = false;
    },
    [fetchAddresses.fulfilled]: (state, action) => {
      const { addresses } = action.payload;
      state.loading = false;
      state.addresses = addresses;
    },

    // handle create address
    [createAddress.pending]: (state) => {
      state.loading = true;
    },
    [createAddress.rejected]: (state, action) => {
      state.loading = false;
    },
    [createAddress.fulfilled]: (state, action) => {
      const { newAddress } = action.payload;
      state.loading = false;
      state.addresses.push(newAddress);
    },

    // handle delete address
    [deleteAddress.pending]: (state) => {
      state.loading = true;
    },
    [deleteAddress.rejected]: (state) => {
      state.loading = false;
    },
    [deleteAddress.fulfilled]: (state, action) => {
      state.loading = false;
      state.addresses = state.addresses.filter(
        (address) => address._id !== action.payload
      );
    },
  },
});

const { reducer } = addressSlice;
export default reducer;
