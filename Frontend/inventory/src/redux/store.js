import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 
import authReducer from "./authSlice"; 

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user", "access", "refresh", "isAuthenticated"],
};


const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
    },
});

export const persistor = persistStore(store);
export default store;