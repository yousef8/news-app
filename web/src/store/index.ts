import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import { setupInterceptors } from "../api";

export const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

setupInterceptors(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
