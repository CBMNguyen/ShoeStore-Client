import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  error: "",
  loading: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.cart.push(action.payload);
    },

    resetCart: (state, action) => {
      state.cart = [];
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
});

const { reducer, actions } = cartSlice;
export const {
  addToCart,
  selectColor,
  selectSize,
  selectQuantity,
  removeProduct,
  resetCart,
} = actions;
export default reducer;
