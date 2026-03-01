import { UserId } from '@/user/domain/value-object/user-id.vo';

export class BlockEntity {
  constructor(
    public readonly blockerId: UserId,
    public readonly blockedId: UserId,
    public readonly createdAt: Date,
  ) {}

  static create(params: { blockerId: UserId; blockedId: UserId }) {
    return new BlockEntity(params.blockerId, params.blockedId, new Date());
  }

  static rehydrate(params: {
    blockerId: string;
    blockedId: string;
    createdAt: Date;
  }) {
    return new BlockEntity(
      UserId.from(params.blockerId),
      UserId.from(params.blockedId),
      params.createdAt,
    );
  }
}
