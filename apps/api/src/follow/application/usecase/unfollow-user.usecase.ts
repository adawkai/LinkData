import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';

// Ports
import type { FollowRepoPort } from '../ports/follow.repo.port';
import type { UserRepoPort } from '@/user/application/port/user.repo.port';

// Errors
import { UserNotFoundError } from '@/user/domain/errors';
import { FollowNotFoundError } from '@/follow/domain/errors';

// Entities, Value Objects, && DTOs
import { UserId } from '@/user/domain/value-object/user-id.vo';
import {
  UnFollowTargetBodyDTO,
  UnFollowTargetResponseDTO,
} from '@social/shared';

@Injectable()
export class UnfollowUserUseCase {
  constructor(
    @Inject(TOKENS.FOLLOW_REPO)
    private readonly followRepo: FollowRepoPort,
    @Inject(TOKENS.USER_REPO)
    private readonly userRepo: UserRepoPort,
  ) {}

  async execute(
    unFollowerId: UserId,
    input: UnFollowTargetBodyDTO,
  ): Promise<UnFollowTargetResponseDTO> {
    const targetId = UserId.from(input.targetUserId);

    // Validate users
    const unFollower = await this.userRepo.findById(unFollowerId);
    if (!unFollower) throw new UserNotFoundError();

    const target = await this.userRepo.findById(targetId);
    if (!target) throw new UserNotFoundError();

    const following =
      await this.followRepo.findFollowByFollowerIdAndFollowingId(
        unFollowerId,
        targetId,
      );
    if (!following) throw new FollowNotFoundError();

    await this.followRepo.delete(following);
    return { ok: true };
  }
}
