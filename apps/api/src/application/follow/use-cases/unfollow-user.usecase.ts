import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '../../tokens';
import type { FollowRepoPort } from '../ports/follow-repo.port';
import type { FollowTargetInput } from '../models/follow.models';
import type { UserId } from '../../_shared/models/ids';

@Injectable()
export class UnfollowUserUseCase {
  constructor(
    @Inject(TOKENS.FOLLOW_REPO)
    private readonly follows: FollowRepoPort,
  ) {}

  async execute(followerId: UserId, input: FollowTargetInput) {
    const targetId = input.targetUserId;
    const following = await this.follows.isFollowing(followerId, targetId);
    if (!following) return { ok: true };
    await this.follows.deleteFollowTx({
      followerId,
      followingId: targetId,
    });
    return { ok: true };
  }
}
