import axios from "axios";
import { logout, selectToken } from "./store/auth/authSlice";
import moment from "moment";
import { jwtDecode } from "jwt-decode";
import { Store } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "/api/v1",
});

export const isTokenExpired = (token: string) => {
  try {
    const decodedToken = jwtDecode(token);
    const expiryTime = decodedToken.exp || 0;
    return expiryTime < moment().unix();
  } catch (error) {
    return true;
  }
};

export const setupInterceptors = (store: Store) => {
  api.interceptors.request.use(
    async (config) => {
      const token = selectToken(store.getState());

      if (token) {
        if (!isTokenExpired(token)) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          store.dispatch(logout());
          toast.error("Session expired. Please log in again.");
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
};
export default api;
