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

import colorReducer from "../features/Product/colorSlice";
import favouriteReducer from "../features/Favourite/FavouriteSlice";
import addressReducer from "./addressSlice";
import cartReducer from "../features/Cart/cartSlice";
import categoryReducer from "../features/Product/categorySlice";
import sizeReducer from "../features/Product/sizeSlice";
import productReducer from "../features/Product/productSlice";
import orderReducer from "../features/Order/orderSlice";
import userReducer from "./userSlice";

const persistConfig = {
  key: "cart",
  storage,
  whitelist: ["cart", "user", "favourite", "address"],
};

const rootReducer = combineReducers({
  cart: cartReducer,
  color: colorReducer,
  favourite: favouriteReducer,
  address: addressReducer,
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
