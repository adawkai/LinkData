import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';
import type { FollowRepo } from '../ports/follow-repo.port';
import type { UserRepo } from '@/user/application/port/user.repo';
import { UnFollowTargetBodyDTO } from '@/follow/interface/dto/follow-target.body.dto';
import { UnFollowTargetResponseDTO } from '@/follow/interface/dto/follow-target.response.dto';
import { UserNotFoundError } from '@/user/domain/errors';
import { FollowNotFoundError } from '@/follow/domain/errors';
import { UserId } from '@/user/domain/value-object/user-id.vo';

@Injectable()
export class UnfollowUserUseCase {
  constructor(
    @Inject(TOKENS.FOLLOW_REPO)
    private readonly followRepo: FollowRepo,
    @Inject(TOKENS.USER_REPO)
    private readonly userRepo: UserRepo,
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
