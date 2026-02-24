import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { UserSummaryRes } from "@social/shared/models/user";

import { api, getApiErrorMessage } from "../../shared/api/client";

type UsersState = {
  items: UserSummaryRes[];
  status: "idle" | "loading" | "failed";
  error: string | null;
  query: string;
  nextCursor: string | null;
  hasMore: boolean;
};

const PAGE_SIZE = 20;

const initialState: UsersState = {
  items: [],
  status: "idle",
  error: null,
  query: "",
  nextCursor: null,
  hasMore: true,
};

type SearchResponse = {
  items: UserSummaryRes[];
  nextCursor: string | null;
};

export const searchUsers = createAsyncThunk<
  { data: SearchResponse; query: string; isReset: boolean },
  { query: string; cursor?: string | null; reset?: boolean }
>("users/search", async ({ query, cursor, reset }, { rejectWithValue }) => {
  try {
    const res = await api.get<SearchResponse>("/users/search", {
      params: { query, cursor, take: PAGE_SIZE },
    });
    return { data: res.data, query, isReset: !!reset };
  } catch (e) {
    return rejectWithValue(getApiErrorMessage(e));
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetSearch(state) {
      state.items = [];
      state.status = "idle";
      state.error = null;
      state.query = "";
      state.nextCursor = null;
      state.hasMore = true;
    },
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        const { data, isReset } = action.payload;
        if (isReset) {
          state.items = data.items;
        } else {
          // Avoid duplicates (though cursor-based should minimize this)
          const existingIds = new Set(state.items.map((u) => u.id));
          const newUsers = data.items.filter((u) => !existingIds.has(u.id));
          state.items = [...state.items, ...newUsers];
        }
        state.status = "idle";
        state.nextCursor = data.nextCursor;
        state.hasMore = data.nextCursor !== null;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to search users";
      });
  },
});

export const { resetSearch, setQuery } = usersSlice.actions;
export default usersSlice.reducer;
