import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { api, getApiErrorMessage } from "../../shared/api/client";
import type { User, UpdatePrivacyDto } from "../users/types";
import { updateMyProfile } from "../users/usersSlice";
import { login, register, logout } from "../auth/authSlice";
import {
  followUser,
  unfollowUser,
  blockUser,
} from "../relations/relationsSlice";

type MeState = {
  me: User | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
};

const initialState: MeState = {
  me: null,
  status: "idle",
  error: null,
};

export const fetchMe = createAsyncThunk<User>(
  "me/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<User>("/users/me");
      return res.data;
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e));
    }
  },
);

export const updatePrivacy = createAsyncThunk<User, UpdatePrivacyDto>(
  "me/updatePrivacy",
  async (dto, { rejectWithValue }) => {
    try {
      await api.patch("/users/me/privacy", dto);
      const res = await api.get<User>("/users/me");
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
        state.error = null;
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
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.me = action.payload;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.me = action.payload.user;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.me = action.payload.user;
      })
      .addCase(logout, (state) => {
        state.me = null;
        state.status = "idle";
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        const { result } = action.payload;
        if (state.me && result.status === "FOLLOWING") {
          state.me.followingCount += 1;
        }
      })
      .addCase(unfollowUser.fulfilled, (state) => {
        if (state.me) {
          state.me.followingCount = Math.max(0, state.me.followingCount - 1);
        }
      })
      .addCase(blockUser.fulfilled, (state) => {
        if (state.me) {
          state.me.followingCount = Math.max(0, state.me.followingCount - 1);
        }
      });
  },
});

export const { clearMe } = meSlice.actions;
export default meSlice.reducer;
