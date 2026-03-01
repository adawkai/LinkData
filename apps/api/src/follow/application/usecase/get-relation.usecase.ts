import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';
import type { FollowRepo } from '../ports/follow-repo.port';
import type { FollowRequestRepo } from '../ports/follow-request-repo.port';
import type { BlockRepo } from '@/block/application/port/block-repo';
import { UserId } from '@/user/domain/value-object/user-id.vo';

export type RelationStatus = 'NONE' | 'FOLLOWING' | 'REQUESTED';

export interface RelationResponseDTO {
  followStatus: RelationStatus;
  blocked: boolean;
}

@Injectable()
export class GetRelationUseCase {
  constructor(
    @Inject(TOKENS.FOLLOW_REPO)
    private readonly followRepo: FollowRepo,
    @Inject(TOKENS.FOLLOW_REQUEST_REPO)
    private readonly followRequestRepo: FollowRequestRepo,
    @Inject(TOKENS.BLOCK_REPO)
    private readonly blockRepo: BlockRepo,
  ) {}

  async execute(
    currentUserId: UserId,
    targetUserId: UserId,
  ): Promise<RelationResponseDTO> {
    const [follow, request, block] = await Promise.all([
      this.followRepo.findFollowByFollowerIdAndFollowingId(
        currentUserId,
        targetUserId,
      ),
      this.followRequestRepo.findFollowRequestByRequesterIdAndRequestedId(
        currentUserId,
        targetUserId,
      ),
      this.blockRepo.findBlockByBlockerIdAndBlockedId(
        currentUserId,
        targetUserId,
      ),
    ]);

    let followStatus: RelationStatus = 'NONE';
    if (follow) {
      followStatus = 'FOLLOWING';
    } else if (request) {
      followStatus = 'REQUESTED';
    }

    return {
      followStatus,
      blocked: !!block,
    };
  }
}
