import { UserId } from '@/user/domain/value-object/user-id.vo';

export class FollowRequestEntity {
  constructor(
    public readonly requesterId: UserId,
    public readonly requestedId: UserId,
    public readonly createdAt: Date,
  ) {}

  static create(params: { requesterId: UserId; requestedId: UserId }) {
    return new FollowRequestEntity(
      params.requesterId,
      params.requestedId,
      new Date(),
    );
  }

  static rehydrate(params: {
    requesterId: string;
    requestedId: string;
    createdAt: Date;
  }) {
    return new FollowRequestEntity(
      UserId.from(params.requesterId),
      UserId.from(params.requestedId),
      params.createdAt,
    );
  }
}
