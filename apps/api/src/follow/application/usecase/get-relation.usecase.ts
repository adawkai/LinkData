import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';

// Ports
import type { FollowRepoPort } from '../ports/follow.repo.port';
import type { FollowRequestRepoPort } from '../ports/follow-request.repo.port';
import type { BlockRepoPort } from '@/block/application/port/block.repo.port';

// Entities, Value Objects, && DTOs
import { UserId } from '@/user/domain/value-object/user-id.vo';
import { RelationStatus, RelationResponseDTO } from '@social/shared';

@Injectable()
export class GetRelationUseCase {
  constructor(
    @Inject(TOKENS.FOLLOW_REPO)
    private readonly followRepo: FollowRepoPort,
    @Inject(TOKENS.FOLLOW_REQUEST_REPO)
    private readonly followRequestRepo: FollowRequestRepoPort,
    @Inject(TOKENS.BLOCK_REPO)
    private readonly blockRepo: BlockRepoPort,
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

    let followStatus: RelationStatus = RelationStatus.NONE;
    if (follow) {
      followStatus = RelationStatus.FOLLOWING;
    } else if (request) {
      followStatus = RelationStatus.REQUESTED;
    }

    return {
      followStatus,
      blocked: !!block,
    };
  }
}
