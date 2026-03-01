import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { api, getApiErrorMessage } from "../../shared/api/client";
import type { User, SearchResponse, UpdateProfileDto } from "./types";
import type { Post, FeedResponse } from "../feed/types";
import {
  followUser,
  unfollowUser,
  blockUser,
} from "../relations/relationsSlice";

type PaginatedState<T> = {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
  status: "idle" | "loading" | "failed";
  error: string | null;
};

type UsersState = {
  items: User[];
  entitiesById: Record<string, User | undefined>;
  entitiesByUsername: Record<string, User | undefined>;
  status: "idle" | "loading" | "failed";
  error: string | null;
  query: string;
  nextCursor: string | null;
  hasMore: boolean;
  // Per-user lists (keyed by userId)
  userPosts: Record<string, PaginatedState<Post> | undefined>;
  followers: Record<string, PaginatedState<User> | undefined>;
  following: Record<string, PaginatedState<User> | undefined>;
};

const PAGE_SIZE = 20;

const initialPaginatedState = <T>(): PaginatedState<T> => ({
  items: [],
  nextCursor: null,
  hasMore: true,
  status: "idle",
  error: null,
});

const initialState: UsersState = {
  items: [],
  entitiesById: {},
  entitiesByUsername: {},
  status: "idle",
  error: null,
  query: "",
  nextCursor: null,
  hasMore: true,
  userPosts: {},
  followers: {},
  following: {},
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

export const fetchUserPosts = createAsyncThunk<
  { userId: string; data: FeedResponse; isReset: boolean },
  { userId: string; cursor?: string | null; reset?: boolean }
>(
  "users/fetchPosts",
  async ({ userId, cursor, reset }, { rejectWithValue }) => {
    try {
      const res = await api.get<FeedResponse>(`/users/${userId}/posts`, {
        params: { cursor, take: PAGE_SIZE },
      });
      return { userId, data: res.data, isReset: !!reset };
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e));
    }
  },
);

export const fetchFollowers = createAsyncThunk<
  { userId: string; data: SearchResponse; isReset: boolean },
  { userId: string; cursor?: string | null; reset?: boolean }
>(
  "users/fetchFollowers",
  async ({ userId, cursor, reset }, { rejectWithValue }) => {
    try {
      const res = await api.get<SearchResponse>(`/users/${userId}/followers`, {
        params: { cursor, take: PAGE_SIZE },
      });
      return { userId, data: res.data, isReset: !!reset };
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e));
    }
  },
);

export const fetchFollowing = createAsyncThunk<
  { userId: string; data: SearchResponse; isReset: boolean },
  { userId: string; cursor?: string | null; reset?: boolean }
>(
  "users/fetchFollowing",
  async ({ userId, cursor, reset }, { rejectWithValue }) => {
    try {
      const res = await api.get<SearchResponse>(`/users/${userId}/following`, {
        params: { cursor, take: PAGE_SIZE },
      });
      return { userId, data: res.data, isReset: !!reset };
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e));
    }
  },
);

export const fetchUserById = createAsyncThunk<User, { userId: string }>(
  "users/fetchById",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const res = await api.get<User>(`/users/${userId}`);
      return res.data;
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e));
    }
  },
);

export const fetchUserByUsername = createAsyncThunk<User, { username: string }>(
  "users/fetchByUsername",
  async ({ username }, { rejectWithValue }) => {
    try {
      const res = await api.get<User>(`/users/by-username/${username}`);
      return res.data;
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e));
    }
  },
);

export const updateMyProfile = createAsyncThunk<User, UpdateProfileDto>(
  "users/updateMyProfile",
  async (dto, { rejectWithValue }) => {
    try {
      const res = await api.patch<User>("/users/me/profile", dto);
      return res.data;
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e));
    }
  },
);

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
    clearEntities(state) {
      state.entitiesById = {};
      state.entitiesByUsername = {};
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
          const existingIds = new Set(state.items.map((u) => u.id));
          const newUsers = data.items.filter((u) => !existingIds.has(u.id));
          state.items = [...state.items, ...newUsers];
        }

        // Cache individual users
        data.items.forEach((user) => {
          state.entitiesById[user.id] = user;
          state.entitiesByUsername[user.username] = user;
        });

        state.status = "idle";
        state.nextCursor = data.nextCursor;
        state.hasMore = data.nextCursor !== null;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to search users";
      })
      .addCase(fetchUserById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = "idle";
        state.entitiesById[action.payload.id] = action.payload;
        state.entitiesByUsername[action.payload.username] = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to fetch user";
      })
      .addCase(fetchUserByUsername.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserByUsername.fulfilled, (state, action) => {
        state.status = "idle";
        state.entitiesById[action.payload.id] = action.payload;
        state.entitiesByUsername[action.payload.username] = action.payload;
      })
      .addCase(fetchUserByUsername.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to fetch user";
      })
      .addCase(updateMyProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.status = "idle";
        state.entitiesById[action.payload.id] = action.payload;
        state.entitiesByUsername[action.payload.username] = action.payload;
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to update profile";
      })
      // User Posts
      .addCase(fetchUserPosts.pending, (state, action) => {
        const { userId } = action.meta.arg;
        if (!state.userPosts[userId])
          state.userPosts[userId] = initialPaginatedState();
        state.userPosts[userId]!.status = "loading";
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        const { userId, data, isReset } = action.payload;
        if (!state.userPosts[userId])
          state.userPosts[userId] = initialPaginatedState();
        const pState = state.userPosts[userId]!;
        pState.status = "idle";
        pState.nextCursor = data.nextCursor;
        pState.hasMore = !!data.nextCursor;
        if (isReset) {
          pState.items = data.items;
        } else {
          pState.items = [...pState.items, ...data.items];
        }
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        const { userId } = action.meta.arg;
        if (state.userPosts[userId]) {
          state.userPosts[userId]!.status = "failed";
          state.userPosts[userId]!.error =
            (action.payload as string) ?? "Failed to fetch posts";
        }
      })
      // Followers
      .addCase(fetchFollowers.pending, (state, action) => {
        const { userId } = action.meta.arg;
        if (!state.followers[userId])
          state.followers[userId] = initialPaginatedState();
        state.followers[userId]!.status = "loading";
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        const { userId, data, isReset } = action.payload;
        if (!state.followers[userId])
          state.followers[userId] = initialPaginatedState();
        const fState = state.followers[userId]!;
        fState.status = "idle";
        fState.nextCursor = data.nextCursor;
        fState.hasMore = !!data.nextCursor;
        if (isReset) {
          fState.items = data.items;
        } else {
          fState.items = [...fState.items, ...data.items];
        }
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        const { userId } = action.meta.arg;
        if (state.followers[userId]) {
          state.followers[userId]!.status = "failed";
          state.followers[userId]!.error =
            (action.payload as string) ?? "Failed to fetch followers";
        }
      })
      // Following
      .addCase(fetchFollowing.pending, (state, action) => {
        const { userId } = action.meta.arg;
        if (!state.following[userId])
          state.following[userId] = initialPaginatedState();
        state.following[userId]!.status = "loading";
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        const { userId, data, isReset } = action.payload;
        if (!state.following[userId])
          state.following[userId] = initialPaginatedState();
        const fState = state.following[userId]!;
        fState.status = "idle";
        fState.nextCursor = data.nextCursor;
        fState.hasMore = !!data.nextCursor;
        if (isReset) {
          fState.items = data.items;
        } else {
          fState.items = [...fState.items, ...data.items];
        }
      })
      .addCase(fetchFollowing.rejected, (state, action) => {
        const { userId } = action.meta.arg;
        if (state.following[userId]) {
          state.following[userId]!.status = "failed";
          state.following[userId]!.error =
            (action.payload as string) ?? "Failed to fetch following";
        }
      })
      .addCase(followUser.fulfilled, (state, action) => {
        const { targetUserId, result } = action.payload;

        if (result.status === "FOLLOWING") {
          const userById = state.entitiesById[targetUserId];
          if (userById) {
            userById.followersCount += 1;
          }

          for (const username in state.entitiesByUsername) {
            const u = state.entitiesByUsername[username];
            if (u && u.id === targetUserId) {
              u.followersCount =
                userById?.followersCount ?? u.followersCount + 1;
            }
          }
        }
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        const { targetUserId } = action.payload;
        const userById = state.entitiesById[targetUserId];
        if (userById) {
          userById.followersCount = Math.max(0, userById.followersCount - 1);
        }

        for (const username in state.entitiesByUsername) {
          const u = state.entitiesByUsername[username];
          if (u && u.id === targetUserId) {
            u.followersCount =
              userById?.followersCount ?? Math.max(0, u.followersCount - 1);
          }
        }
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        const { targetUserId } = action.payload;
        const userById = state.entitiesById[targetUserId];
        if (userById) {
          userById.followersCount = Math.max(0, userById.followersCount - 1);
        }

        for (const username in state.entitiesByUsername) {
          const u = state.entitiesByUsername[username];
          if (u && u.id === targetUserId) {
            u.followersCount =
              userById?.followersCount ?? Math.max(0, u.followersCount - 1);
          }
        }
      });
  },
});

export const { resetSearch, setQuery, clearEntities } = usersSlice.actions;
export default usersSlice.reducer;
