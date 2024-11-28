import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "./authSlice";
import cartReducer from "./cartSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
const persistConfig = {
    key: "root",
    storage,
  };
  const reducers = combineReducers({
    authentication: authenticationReducer,
    cart: cartReducer
});
const persistedReducer = persistReducer(persistConfig, reducers);
const store = configureStore({
    reducer: persistedReducer
})

export const persistor = persistStore(store);
export default store;