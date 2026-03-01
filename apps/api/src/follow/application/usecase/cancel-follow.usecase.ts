import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';
import type { FollowRequestRepo } from '../ports/follow-request-repo.port';
import type { UserRepo } from '@/user/application/port/user.repo';
import { CancelFollowBodyDTO } from '@/follow/interface/dto/follow-target.body.dto';
import { CancelFollowResponseDTO } from '@/follow/interface/dto/follow-target.response.dto';
import { UserNotFoundError } from '@/user/domain/errors';
import { FollowRequestNotFoundError } from '../../domain/errors';
import { UserId } from '@/user/domain/value-object/user-id.vo';

@Injectable()
export class CancelFollowUseCase {
  constructor(
    @Inject(TOKENS.FOLLOW_REQUEST_REPO)
    private readonly followRequestRepo: FollowRequestRepo,
    @Inject(TOKENS.USER_REPO)
    private readonly userRepo: UserRepo,
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
