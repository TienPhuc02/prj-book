import { combineReducers, configureStore } from "@reduxjs/toolkit";
import accountReducer from "../redux/account/accountSlice";
import orderSlice from "./order/orderSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";
import counterSlice from "./counter/counterSlice";
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["account"],
};
const rootReducer = combineReducers({
  account: accountReducer,
  counter: counterSlice,
  order: orderSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
const persistor = persistStore(store);
export { store, persistor };
