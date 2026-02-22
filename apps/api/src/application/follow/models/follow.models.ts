import type {
  UserId,
  FollowKey,
  FollowRequestKey,
} from '../../_shared/models/ids';

// DB-like records (useful for ports/repo implementations)
export type FollowRecord = FollowKey & {
  createdAt: Date;
};

export type FollowRequestRecord = FollowRequestKey & {
  createdAt: Date;
};

// Use-case outputs
export type FollowActionResult =
  | { status: 'FOLLOWING' }
  | { status: 'REQUESTED' };

export type FollowTargetInput = {
  targetUserId: UserId;
};

export type FollowRequestDecisionInput = {
  requesterId: UserId;
};
