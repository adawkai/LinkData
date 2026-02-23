import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { UserMeRes } from "@social/shared/models/user";

import { api, getApiErrorMessage } from "../../shared/api/client";
import type { UpdatePrivacyDto } from "@social/shared/models/user";

type MeState = {
  me: UserMeRes | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
};

const initialState: MeState = {
  me: null,
  status: "idle",
  error: null,
};

export const fetchMe = createAsyncThunk<UserMeRes>(
  "me/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<UserMeRes>("/users/me");
      return res.data;
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e));
    }
  },
);

export const updatePrivacy = createAsyncThunk<UserMeRes, UpdatePrivacyDto>(
  "me/updatePrivacy",
  async (dto, { rejectWithValue }) => {
    try {
      await api.patch("/users/me/privacy", dto);
      const res = await api.get<UserMeRes>("/users/me");
      return res.data;
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e));
    }
  },
);

const meSlice = createSlice({
  name: "me",
  initialState,
  reducers: {
    clearMe(state) {
      state.me = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = "idle";
        state.me = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to load user";
      })
      .addCase(updatePrivacy.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updatePrivacy.fulfilled, (state, action) => {
        state.status = "idle";
        state.me = action.payload;
      })
      .addCase(updatePrivacy.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to update privacy";
      });
  },
});

export const { clearMe } = meSlice.actions;
export default meSlice.reducer;

