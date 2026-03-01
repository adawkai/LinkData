import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';
import type { FollowRepo } from '../ports/follow-repo.port';
import type { FollowRequestRepo } from '../ports/follow-request-repo.port';
import type { UserRepo } from '@/user/application/port/user.repo';
import { AcceptFollowBodyDTO } from '@/follow/interface/dto/accept-follow.body.dto';
import { AcceptFollowResponseDTO } from '@/follow/interface/dto/accept-follow.response';
import { UserNotFoundError } from '@/user/domain/errors';
import {
  AlreadyFollowedError,
  FollowRequestNotFoundError,
} from '@/follow/domain/errors';
import { FollowEntity } from '../../domain/follow.entity';
import { UserId } from '@/user/domain/value-object/user-id.vo';

@Injectable()
export class AcceptFollowUseCase {
  constructor(
    @Inject(TOKENS.FOLLOW_REPO)
    private readonly followRepo: FollowRepo,
    @Inject(TOKENS.FOLLOW_REQUEST_REPO)
    private readonly followRequestRepo: FollowRequestRepo,
    @Inject(TOKENS.USER_REPO)
    private readonly userRepo: UserRepo,
  ) {}

  async execute(
    accepterId: UserId,
    input: AcceptFollowBodyDTO,
  ): Promise<AcceptFollowResponseDTO> {
    const requesterId = UserId.from(input.requesterId);

    const requester = await this.userRepo.findById(requesterId);
    if (!requester) throw new UserNotFoundError();

    const accepter = await this.userRepo.findById(accepterId);
    if (!accepter) throw new UserNotFoundError();

    const followRequest =
      await this.followRequestRepo.findFollowRequestByRequesterIdAndRequestedId(
        requesterId,
        accepterId,
      );
    if (!followRequest) throw new FollowRequestNotFoundError();

    let follow = await this.followRepo.findFollowByFollowerIdAndFollowingId(
      requesterId,
      accepterId,
    );

    if (follow) throw new AlreadyFollowedError();

    follow = FollowEntity.create({
      followerId: requesterId,
      followingId: accepterId,
    });

    await this.followRepo.create(follow);
    await this.followRequestRepo.delete(followRequest);
    return { ok: true };
  }
}
