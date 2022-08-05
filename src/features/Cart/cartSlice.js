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

    updateToCart: (state, action) => {
      const { cartItemIndex, color, size } = action.payload;
      state.cart[cartItemIndex].selectedColor = color;
      state.cart[cartItemIndex].selectedSize = size;
    },

    resetCart: (state, action) => {
      state.cart = [];
    },

    selectSize: (state, action) => {
      const { cartItemIndex, size } = action.payload;
      state.cart[cartItemIndex].selectedSize = size;
    },

    selectColor: (state, action) => {
      const { id, color } = action.payload;
      const index = state.cart.findIndex((product) => product._id === id);
      if (index < 0) return;
      state.cart[index].selectedColor = color;
    },

    selectQuantity: (state, action) => {
      const { cartItemIndex, quantity, currentProductIndex } = action.payload;
      state.cart[cartItemIndex].selectedQuantity = quantity;
      if (currentProductIndex !== undefined) {
        state.cart.splice(currentProductIndex, 1);
      }
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
  updateToCart,
  selectColor,
  selectSize,
  selectQuantity,
  removeProduct,
  resetCart,
} = actions;
export default reducer;
