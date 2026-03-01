import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';
import type { UserRepo } from '@/user/application/port/user.repo';
import { RejectFollowBodyDTO } from '@/follow/interface/dto/accept-follow.body.dto';
import type { FollowRequestRepo } from '../ports/follow-request-repo.port';
import { RejectFollowResponseDTO } from '@/follow/interface/dto/accept-follow.response';
import { UserNotFoundError } from '@/user/domain/errors';
import { FollowRequestNotFoundError } from '@/follow/domain/errors';
import { UserId } from '@/user/domain/value-object/user-id.vo';

@Injectable()
export class RejectFollowUseCase {
  constructor(
    @Inject(TOKENS.FOLLOW_REQUEST_REPO)
    private readonly followRequestRepo: FollowRequestRepo,
    @Inject(TOKENS.USER_REPO)
    private readonly userRepo: UserRepo,
  ) {}

  async execute(
    rejectorId: UserId,
    input: RejectFollowBodyDTO,
  ): Promise<RejectFollowResponseDTO> {
    const requesterId = UserId.from(input.requesterId);

    // Validate users
    const rejector = await this.userRepo.findById(rejectorId);
    if (!rejector) throw new UserNotFoundError();

    const requester = await this.userRepo.findById(requesterId);
    if (!requester) throw new UserNotFoundError();

    const followRequest =
      await this.followRequestRepo.findFollowRequestByRequesterIdAndRequestedId(
        requesterId,
        requesterId,
      );
    if (!followRequest) throw new FollowRequestNotFoundError();

    await this.followRequestRepo.delete(followRequest);
    return { ok: true };
  }
}
