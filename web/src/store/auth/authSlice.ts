import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import User from "../../interfaces/user";
import LoginCredentials from "../../interfaces/loginCredentials";
import api from "../../api";
import LoginResponse from "../../interfaces/loginResponse";

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuth: boolean;
  loading: boolean;
  failed: boolean;
  error: unknown | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuth: false,
  loading: false,
  failed: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, thunkApi) => {
    try {
      const response = await api.post("/login", credentials);
      return response.data;
    } catch (err: any) {
      return thunkApi.rejectWithValue(
        err.response ? err.response.data.message : err.message
      );
    }
  }
);

export const userData = createAsyncThunk(
  "auth/userData",
  async (_, thunkApi) => {
    try {
      const response = await api.get("/me");
      return response.data;
    } catch (err: any) {
      return thunkApi.rejectWithValue(
        err.response ? err.response.data.message : err.message
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuth = false;
      state.failed = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.failed = false;
        state.error = null;
        state.isAuth = false;
        state.user = null;
        state.token = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.isAuth = true;
          state.loading = false;
          state.failed = false;
          state.error = null;
          state.token = action.payload.token;
          state.user = action.payload.user;
          localStorage.setItem("token", action.payload.token);
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuth = false;
        state.failed = true;
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(userData.pending, (state) => {
        state.loading = true;
        state.failed = false;
        state.error = null;
      })
      .addCase(userData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuth = true;
        state.token = localStorage.getItem("token");
      })
      .addCase(userData.rejected, (state, action) => {
        state.loading = false;
        state.failed = true;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
