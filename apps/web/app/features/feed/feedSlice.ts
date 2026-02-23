import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { FeedItemRes } from "@social/shared/models/post";
import type { CreatePostDto } from "@social/shared/models/post";

import { api, getApiErrorMessage } from "../../shared/api/client";

type FeedState = {
  items: FeedItemRes[];
  status: "idle" | "loading" | "failed";
  error: string | null;
};

const initialState: FeedState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchFeed = createAsyncThunk<FeedItemRes[]>(
  "feed/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<FeedItemRes[]>("/posts/feed");
      return res.data;
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e));
    }
  },
);

export const createPost = createAsyncThunk<void, CreatePostDto>(
  "feed/createPost",
  async (dto, { dispatch, rejectWithValue }) => {
    try {
      await api.post("/posts", dto);
      await dispatch(fetchFeed());
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e));
    }
  },
);

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    clearFeed(state) {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to load feed";
      })
      .addCase(createPost.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to create post";
      });
  },
});

export const { clearFeed } = feedSlice.actions;
export default feedSlice.reducer;

