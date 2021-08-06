import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cartApi from "api/product";

const initialState = {
  cart: [],
  error: "",
  loading: false,
};

export const fetchCartById = createAsyncThunk(
  "cart/fetchCart",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const cart = await cartApi.get(id);
      return fulfillWithValue(cart);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.cart.push(action.payload);
    },

    selectSize: (state, action) => {
      const { id, size } = action.payload;
      const index = state.cart.findIndex((product) => product._id === id);
      if (index < 0) return;
      state.cart[index].selectedSize = size;
    },

    selectColor: (state, action) => {
      const { id, color } = action.payload;
      const index = state.cart.findIndex((product) => product._id === id);
      if (index < 0) return;
      state.cart[index].selectedColor = color;
    },

    selectQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const index = state.cart.findIndex((product) => product._id === id);
      if (index < 0) return;
      state.cart[index].selectedQuantity = quantity;
    },

    removeProduct: (state, action) => {
      const { id } = action.payload;
      const index = state.cart.findIndex((product) => product._id === id);
      if (index < 0) return;
      state.cart.splice(index, 1);
    },
  },
  extraReducers: {
    // handle fetch cart by id
    [fetchCartById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [fetchCartById.fulfilled]: (state, action) => {
      const { products } = action.payload;
      state.loading = false;
      state.products = products;
      state.error = "";
    },
  },
});

const { reducer, actions } = cartSlice;
export const {
  addToCart,
  selectColor,
  selectSize,
  selectQuantity,
  removeProduct,
} = actions;
export default reducer;
