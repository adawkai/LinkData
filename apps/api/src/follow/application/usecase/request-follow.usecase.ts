import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';

// Ports
import type { UserRepoPort } from '@/user/application/port/user.repo.port';
import type { FollowRequestRepoPort } from '../ports/follow-request.repo.port';

// Errors
import { UserNotFoundError } from '@/user/domain/errors';
import {
  AlreadyFollowedError,
  UserIsPrivateError,
} from '@/follow/domain/errors';

// Entities, Value Objects, && DTOs
import { FollowRequestEntity } from '@/follow/domain/follow-request.entity';
import { UserId } from '@/user/domain/value-object/user-id.vo';
import {
  FollowTargetBodyDTO,
  FollowTargetResponseDTO,
  FollowTargetStatus,
} from '@social/shared';

@Injectable()
export class RequestFollowUseCase {
  constructor(
    @Inject(TOKENS.FOLLOW_REQUEST_REPO)
    private readonly followRequestRepo: FollowRequestRepoPort,
    @Inject(TOKENS.USER_REPO)
    private readonly userRepo: UserRepoPort,
  ) {}

  async execute(
    requesterId: UserId,
    input: FollowTargetBodyDTO,
  ): Promise<FollowTargetResponseDTO> {
    const targetId = UserId.from(input.targetUserId);

    const follower = await this.userRepo.findById(requesterId);
    if (!follower) throw new UserNotFoundError();

    const target = await this.userRepo.findById(targetId);
    if (!target) throw new UserNotFoundError();

    if (target.isPrivate) throw new UserIsPrivateError();

    let followRequest =
      await this.followRequestRepo.findFollowRequestByRequesterIdAndRequestedId(
        requesterId,
        targetId,
      );
    if (followRequest) throw new AlreadyFollowedError();

    followRequest = FollowRequestEntity.create({
      requesterId: requesterId,
      requestedId: targetId,
    });

    await this.followRequestRepo.create(followRequest);

    return { ok: true, status: FollowTargetStatus.REQUESTED };
  }
}
