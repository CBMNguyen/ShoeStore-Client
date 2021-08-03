import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import productReducer from "../features/Home/productSlice";
import categoryReducer from "../features/Home/categorySlice";
import colorReducer from "../features/Home/colorSlice";
import sizeReducer from "../features/Home/sizeSlice";

const rootReducer = combineReducers({
  products: productReducer,
  category: categoryReducer,
  color: colorReducer,
  size: sizeReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
