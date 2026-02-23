import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { ProfileViewRes, UpdateProfileDto } from "@social/shared/models/profile";
import type { UserSummaryRes } from "@social/shared/models/user";

import { api, getApiErrorMessage } from "../../shared/api/client";

type ProfilesState = {
  myProfile: ProfileViewRes | null;
  profilesByUserId: Record<string, ProfileViewRes | undefined>;
  usersByUsername: Record<string, UserSummaryRes | undefined>;
  status: "idle" | "loading" | "failed";
  error: string | null;
};

const initialState: ProfilesState = {
  myProfile: null,
  profilesByUserId: {},
  usersByUsername: {},
  status: "idle",
  error: null,
};

export const fetchProfileByUserId = createAsyncThunk<
  ProfileViewRes,
  { userId: string; asMyProfile?: boolean }
>("profiles/fetchByUserId", async ({ userId }, { rejectWithValue }) => {
  try {
    const res = await api.get<ProfileViewRes>(`/profiles/${userId}`);
    return res.data;
  } catch (e) {
    return rejectWithValue(getApiErrorMessage(e));
  }
});

export const updateMyProfile = createAsyncThunk<ProfileViewRes, UpdateProfileDto>(
  "profiles/updateMyProfile",
  async (dto, { rejectWithValue }) => {
    try {
      const res = await api.patch<ProfileViewRes>("/profiles/me", dto);
      return res.data;
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e));
    }
  },
);

export const fetchUserByUsername = createAsyncThunk<UserSummaryRes, { username: string }>(
  "profiles/fetchUserByUsername",
  async ({ username }, { rejectWithValue }) => {
    try {
      const res = await api.get<UserSummaryRes>(`/users/by-username/${username}`);
      return res.data;
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e));
    }
  },
);

const profilesSlice = createSlice({
  name: "profiles",
  initialState,
  reducers: {
    clearProfiles(state) {
      state.myProfile = null;
      state.profilesByUserId = {};
      state.usersByUsername = {};
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileByUserId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfileByUserId.fulfilled, (state, action) => {
        state.status = "idle";
        state.profilesByUserId[action.payload.userId] = action.payload;
        const arg = action.meta.arg;
        if (arg?.asMyProfile) state.myProfile = action.payload;
      })
      .addCase(fetchProfileByUserId.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to load profile";
      })
      .addCase(updateMyProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.status = "idle";
        state.myProfile = action.payload;
        state.profilesByUserId[action.payload.userId] = action.payload;
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to update profile";
      })
      .addCase(fetchUserByUsername.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserByUsername.fulfilled, (state, action) => {
        state.status = "idle";
        state.usersByUsername[action.payload.username] = action.payload;
      })
      .addCase(fetchUserByUsername.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to resolve user";
      });
  },
});

export const { clearProfiles } = profilesSlice.actions;
export default profilesSlice.reducer;

