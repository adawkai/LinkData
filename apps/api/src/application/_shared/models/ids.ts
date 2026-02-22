export type UserId = string;
export type PostId = string;
export type ProfileId = string;

// composite ids are represented as pairs, not strings
export type FollowKey = { followerId: UserId; followingId: UserId };
export type FollowRequestKey = { requesterId: UserId; requestedId: UserId };
export type BlockKey = { blockerId: UserId; blockedId: UserId };
