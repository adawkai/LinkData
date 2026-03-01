import { Inject, Injectable, Logger } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';
import type { FollowRepo } from '../ports/follow-repo.port';
import type { UserRepo } from '@/user/application/port/user.repo';
import { FollowTargetBodyDTO } from '@/follow/interface/dto/follow-target.body.dto';
import { FollowTargetResponseDTO } from '@/follow/interface/dto/follow-target.response.dto';
import { UserNotFoundError } from '@/user/domain/errors';
import {
  AlreadyFollowedError,
  UserIsPrivateError,
} from '@/follow/domain/errors';
import { FollowEntity } from '@/follow/domain/follow.entity';
import { FollowRequestEntity } from '@/follow/domain/follow-request.entity';
import type { FollowRequestRepo } from '../ports/follow-request-repo.port';
import { UserId } from '@/user/domain/value-object/user-id.vo';

@Injectable()
export class FollowUserUseCase {
  constructor(
    @Inject(TOKENS.FOLLOW_REPO)
    private readonly followRepo: FollowRepo,
    @Inject(TOKENS.FOLLOW_REQUEST_REPO)
    private readonly followRequestRepo: FollowRequestRepo,
    @Inject(TOKENS.USER_REPO)
    private readonly userRepo: UserRepo,
  ) {}

  async execute(
    followerId: UserId,
    input: FollowTargetBodyDTO,
  ): Promise<FollowTargetResponseDTO> {
    const targetId = UserId.from(input.targetUserId);

    // Validate users
    const follower = await this.userRepo.findById(followerId);
    if (!follower) throw new UserNotFoundError();

    const target = await this.userRepo.findById(targetId);
    if (!target) throw new UserNotFoundError();

    // Check if already following
    let follow = await this.followRepo.findFollowByFollowerIdAndFollowingId(
      followerId,
      targetId,
    );
    if (follow) throw new AlreadyFollowedError();

    // Check if already requested
    let request =
      await this.followRequestRepo.findFollowRequestByRequesterIdAndRequestedId(
        followerId,
        targetId,
      );
    if (request) throw new AlreadyFollowedError();

    if (target.isPrivate) {
      const followRequest = FollowRequestEntity.create({
        requesterId: followerId,
        requestedId: targetId,
      });
      await this.followRequestRepo.create(followRequest);
      return { ok: true, status: 'REQUESTED' };
    } else {
      follow = FollowEntity.create({
        followerId,
        followingId: targetId,
      });
      await this.followRepo.create(follow);
      return { ok: true, status: 'FOLLOWING' };
    }
  }
}
