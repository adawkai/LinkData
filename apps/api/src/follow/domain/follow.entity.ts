import { UserId } from '@/user/domain/value-object/user-id.vo';

export class FollowEntity {
  constructor(
    public readonly followerId: UserId,
    public readonly followingId: UserId,
    public readonly createdAt: Date,
  ) {}

  static create(params: { followerId: UserId; followingId: UserId }) {
    return new FollowEntity(params.followerId, params.followingId, new Date());
  }

  static rehydrate(params: {
    followerId: string;
    followingId: string;
    createdAt: Date;
  }) {
    return new FollowEntity(
      UserId.from(params.followerId),
      UserId.from(params.followingId),
      params.createdAt,
    );
  }
}
