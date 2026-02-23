import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { AuthRes, LoginDto, RegisterDto } from "@social/shared/models/auth";

import { api, getApiErrorMessage } from "../../shared/api/client";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "../../shared/auth/tokenStorage";

type AuthState = {
  accessToken: string | null;
  user: AuthRes["user"] | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
};

const initialState: AuthState = {
  accessToken: getAccessToken(),
  user: null,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk<AuthRes, LoginDto>(
  "auth/login",
  async (dto, { rejectWithValue }) => {
    try {
      const res = await api.post<AuthRes>("/auth/login", dto);
      return res.data;
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e));
    }
  },
);

export const register = createAsyncThunk<AuthRes, RegisterDto>(
  "auth/register",
  async (dto, { rejectWithValue }) => {
    try {
      const res = await api.post<AuthRes>("/auth/register", dto);
      return res.data;
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e));
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.user = null;
      state.status = "idle";
      state.error = null;
      clearAccessToken();
    },
    setUser(state, action: PayloadAction<AuthRes["user"]>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        setAccessToken(action.payload.accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Login failed";
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        setAccessToken(action.payload.accessToken);
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Registration failed";
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;

