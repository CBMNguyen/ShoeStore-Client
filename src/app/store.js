import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

import colorReducer from "../features/Home/colorSlice";
import cartReducer from "../features/Cart/cartSlice";
import categoryReducer from "../features/Home/categorySlice";
import sizeReducer from "../features/Home/sizeSlice";
import productReducer from "../features/Home/productSlice";
import orderReducer from "../features/Order/orderSlice";
import userReducer from "./userSlice";

const persistConfig = {
  key: "cart",
  storage,
  whitelist: ["cart", "user"],
};

const rootReducer = combineReducers({
  cart: cartReducer,
  color: colorReducer,
  category: categoryReducer,
  size: sizeReducer,
  products: productReducer,
  user: userReducer,
  order: orderReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

export const persistor = persistStore(store);
export default store;
