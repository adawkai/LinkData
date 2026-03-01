import { FollowEntity } from '@/follow/domain/follow.entity';
import { UserId } from '@/user/domain/value-object/user-id.vo';

export interface FollowRepo {
  create(follow: FollowEntity): Promise<void>;
  delete(follow: FollowEntity): Promise<void>;
  findFollowByFollowerIdAndFollowingId(
    followerId: UserId,
    followingId: UserId,
  ): Promise<FollowEntity | null>;
}
