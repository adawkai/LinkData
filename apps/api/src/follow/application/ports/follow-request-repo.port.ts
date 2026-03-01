import { FollowRequestEntity } from '@/follow/domain/follow-request.entity';
import { UserId } from '@/user/domain/value-object/user-id.vo';

export interface FollowRequestRepo {
  create(followRequest: FollowRequestEntity): Promise<void>;
  delete(followRequest: FollowRequestEntity): Promise<void>;
  findFollowRequestByRequesterIdAndRequestedId(
    requesterId: UserId,
    requestedId: UserId,
  ): Promise<FollowRequestEntity | null>;
}
