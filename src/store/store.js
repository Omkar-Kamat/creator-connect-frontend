import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import assetReducer from "./slices/assetSlice";
import chatReducer from "./slices/chatSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    asset: assetReducer,
    chat: chatReducer
  }
});