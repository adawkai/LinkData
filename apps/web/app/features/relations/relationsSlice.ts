import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type {
  FollowActionResultRes,
  FollowRequestDecisionDto,
  FollowTargetDto,
} from "@social/shared/models/follow";
import type { BlockTargetDto } from "@social/shared/models/block";

import { api, getApiErrorMessage } from "../../shared/api/client";

export type RelationStatus = "NONE" | "FOLLOWING" | "REQUESTED";

export type RelationState = {
  followStatus: RelationStatus;
  blocked: boolean;
};

type RelationsSliceState = {
  byUserId: Record<string, RelationState | undefined>;
  status: "idle" | "loading" | "failed";
  error: string | null;
};

const initialState: RelationsSliceState = {
  byUserId: {},
  status: "idle",
  error: null,
};

export const followUser = createAsyncThunk<
  { targetUserId: string; result: FollowActionResultRes },
  FollowTargetDto
>("relations/follow", async (dto, { rejectWithValue }) => {
  try {
    const res = await api.post<FollowActionResultRes>("/follow", dto);
    return { targetUserId: dto.targetUserId, result: res.data };
  } catch (e) {
    return rejectWithValue(getApiErrorMessage(e));
  }
});

export const unfollowUser = createAsyncThunk<{ targetUserId: string }, FollowTargetDto>(
  "relations/unfollow",
  async (dto, { rejectWithValue }) => {
    try {
      await api.delete("/follow", { data: dto });
      return { targetUserId: dto.targetUserId };
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e));
    }
  },
);

export const cancelFollowRequest = createAsyncThunk<
  { targetUserId: string },
  FollowTargetDto
>("relations/cancelRequest", async (dto, { rejectWithValue }) => {
  try {
    await api.post("/follow/requests/cancel", dto);
    return { targetUserId: dto.targetUserId };
  } catch (e) {
    return rejectWithValue(getApiErrorMessage(e));
  }
});

export const acceptFollowRequest = createAsyncThunk<
  { requesterId: string },
  FollowRequestDecisionDto
>("relations/acceptRequest", async (dto, { rejectWithValue }) => {
  try {
    await api.post("/follow/requests/accept", dto);
    return { requesterId: dto.requesterId };
  } catch (e) {
    return rejectWithValue(getApiErrorMessage(e));
  }
});

export const rejectFollowRequest = createAsyncThunk<
  { requesterId: string },
  FollowRequestDecisionDto
>("relations/rejectRequest", async (dto, { rejectWithValue }) => {
  try {
    await api.post("/follow/requests/reject", dto);
    return { requesterId: dto.requesterId };
  } catch (e) {
    return rejectWithValue(getApiErrorMessage(e));
  }
});

export const blockUser = createAsyncThunk<{ targetUserId: string }, BlockTargetDto>(
  "relations/block",
  async (dto, { rejectWithValue }) => {
    try {
      await api.post("/blocks", dto);
      return { targetUserId: dto.targetUserId };
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e));
    }
  },
);

export const unblockUser = createAsyncThunk<{ targetUserId: string }, BlockTargetDto>(
  "relations/unblock",
  async (dto, { rejectWithValue }) => {
    try {
      await api.delete("/blocks", { data: dto });
      return { targetUserId: dto.targetUserId };
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e));
    }
  },
);

const relationsSlice = createSlice({
  name: "relations",
  initialState,
  reducers: {
    clearRelations(state) {
      state.byUserId = {};
      state.status = "idle";
      state.error = null;
    },
    setRelationState(
      state,
      action: { payload: { targetUserId: string; rel: Partial<RelationState> } },
    ) {
      const current = state.byUserId[action.payload.targetUserId] ?? {
        followStatus: "NONE" as const,
        blocked: false,
      };
      state.byUserId[action.payload.targetUserId] = {
        ...current,
        ...action.payload.rel,
      };
    },
  },
  extraReducers: (builder) => {
    const start = (state: RelationsSliceState) => {
      state.status = "loading";
      state.error = null;
    };
    const fail = (state: RelationsSliceState, action: any) => {
      state.status = "failed";
      state.error = (action.payload as string) ?? "Action failed";
    };
    const done = (state: RelationsSliceState) => {
      state.status = "idle";
    };

    builder
      .addCase(followUser.pending, start)
      .addCase(unfollowUser.pending, start)
      .addCase(cancelFollowRequest.pending, start)
      .addCase(acceptFollowRequest.pending, start)
      .addCase(rejectFollowRequest.pending, start)
      .addCase(blockUser.pending, start)
      .addCase(unblockUser.pending, start)
      .addCase(followUser.rejected, fail)
      .addCase(unfollowUser.rejected, fail)
      .addCase(cancelFollowRequest.rejected, fail)
      .addCase(acceptFollowRequest.rejected, fail)
      .addCase(rejectFollowRequest.rejected, fail)
      .addCase(blockUser.rejected, fail)
      .addCase(unblockUser.rejected, fail)
      .addCase(followUser.fulfilled, (state, action) => {
        done(state);
        const prev = state.byUserId[action.payload.targetUserId] ?? {
          followStatus: "NONE" as const,
          blocked: false,
        };
        state.byUserId[action.payload.targetUserId] = {
          ...prev,
          followStatus: action.payload.result.status,
        };
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        done(state);
        const prev = state.byUserId[action.payload.targetUserId] ?? {
          followStatus: "NONE" as const,
          blocked: false,
        };
        state.byUserId[action.payload.targetUserId] = {
          ...prev,
          followStatus: "NONE",
        };
      })
      .addCase(cancelFollowRequest.fulfilled, (state, action) => {
        done(state);
        const prev = state.byUserId[action.payload.targetUserId] ?? {
          followStatus: "NONE" as const,
          blocked: false,
        };
        state.byUserId[action.payload.targetUserId] = {
          ...prev,
          followStatus: "NONE",
        };
      })
      .addCase(acceptFollowRequest.fulfilled, done)
      .addCase(rejectFollowRequest.fulfilled, done)
      .addCase(blockUser.fulfilled, (state, action) => {
        done(state);
        const prev = state.byUserId[action.payload.targetUserId] ?? {
          followStatus: "NONE" as const,
          blocked: false,
        };
        state.byUserId[action.payload.targetUserId] = {
          ...prev,
          blocked: true,
          followStatus: "NONE",
        };
      })
      .addCase(unblockUser.fulfilled, (state, action) => {
        done(state);
        const prev = state.byUserId[action.payload.targetUserId] ?? {
          followStatus: "NONE" as const,
          blocked: false,
        };
        state.byUserId[action.payload.targetUserId] = {
          ...prev,
          blocked: false,
        };
      });
  },
});

export const { clearRelations, setRelationState } = relationsSlice.actions;
export default relationsSlice.reducer;

