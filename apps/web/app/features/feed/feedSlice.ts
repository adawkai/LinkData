import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { api, getApiErrorMessage } from "../../shared/api/client";
import type { Post, CreatePostDto, FeedResponse } from "./types";

type FeedState = {
  items: Post[];
  status: "idle" | "loading" | "failed";
  error: string | null;
  nextCursor: string | null;
  hasMore: boolean;
};

const PAGE_SIZE = 20;

const initialState: FeedState = {
  items: [],
  status: "idle",
  error: null,
  nextCursor: null,
  hasMore: true,
};

export const fetchFeed = createAsyncThunk<
  { data: FeedResponse; isReset: boolean },
  { cursor?: string | null; reset?: boolean } | void
>("feed/fetch", async (params, { rejectWithValue }) => {
  try {
    const cursor = params ? params.cursor : undefined;
    const reset = params ? params.reset : false;
    const res = await api.get<FeedResponse>("/posts/feed", {
      params: { cursor, take: PAGE_SIZE },
    });
    return { data: res.data, isReset: !!reset };
  } catch (e) {
    return rejectWithValue(getApiErrorMessage(e));
  }
});

export const createPost = createAsyncThunk<Post, CreatePostDto>(
  "feed/createPost",
  async (dto, { rejectWithValue }) => {
    try {
      const res = await api.post<{ ok: boolean; post: Post }>("/posts", dto);
      return res.data.post;
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
      state.nextCursor = null;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        const { data, isReset } = action.payload;
        if (isReset) {
          state.items = data.items;
        } else {
          const existingIds = new Set(state.items.map((p) => p.id));
          const newItems = data.items.filter((p) => !existingIds.has(p.id));
          state.items = [...state.items, ...newItems];
        }
        state.status = "idle";
        state.nextCursor = data.nextCursor;
        state.hasMore = data.nextCursor !== null;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to load feed";
      })
      .addCase(createPost.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.status = "idle";
        // Prepend the new post
        state.items = [action.payload, ...state.items];
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to create post";
      });
  },
});

export const { clearFeed } = feedSlice.actions;
export default feedSlice.reducer;
