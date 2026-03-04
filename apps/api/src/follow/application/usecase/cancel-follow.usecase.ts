import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';

// Ports
import type { FollowRequestRepoPort } from '@/follow/application/ports/follow-request.repo.port';
import type { UserRepoPort } from '@/user/application/port/user.repo.port';

// Errors
import { UserNotFoundError } from '@/user/domain/errors';
import { FollowRequestNotFoundError } from '@/follow/domain/errors';

// Entities, Value Objects, && DTOs
import { UserId } from '@/user/domain/value-object/user-id.vo';
import { CancelFollowBodyDTO, CancelFollowResponseDTO } from '@social/shared';

@Injectable()
export class CancelFollowUseCase {
  constructor(
    @Inject(TOKENS.FOLLOW_REQUEST_REPO)
    private readonly followRequestRepo: FollowRequestRepoPort,
    @Inject(TOKENS.USER_REPO)
    private readonly userRepo: UserRepoPort,
  ) {}

  async execute(
    requesterId: UserId,
    input: CancelFollowBodyDTO,
  ): Promise<CancelFollowResponseDTO> {
    const targetId = UserId.from(input.targetUserId);

    // Validate users
    const requester = await this.userRepo.findById(requesterId);
    if (!requester) throw new UserNotFoundError();

    const target = await this.userRepo.findById(targetId);
    if (!target) throw new UserNotFoundError();

    const followRequest =
      await this.followRequestRepo.findFollowRequestByRequesterIdAndRequestedId(
        requesterId,
        targetId,
      );
    if (!followRequest) throw new FollowRequestNotFoundError();

    await this.followRequestRepo.delete(followRequest);
    return { ok: true };
  }
}
