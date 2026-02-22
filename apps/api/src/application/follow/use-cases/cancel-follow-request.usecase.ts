import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '../../tokens';
import type { FollowRequestRepoPort } from '../ports/follow-request-repo.port';
import type { FollowTargetInput } from '../models/follow.models';
import type { UserId } from '../../_shared/models/ids';

@Injectable()
export class CancelFollowRequestUseCase {
  constructor(
    @Inject(TOKENS.FOLLOW_REQUEST_REPO)
    private readonly requests: FollowRequestRepoPort,
  ) {}

  async execute(requesterId: UserId, input: FollowTargetInput) {
    const targetId = input.targetUserId;
    const has = await this.requests.exists(requesterId, targetId);
    if (!has) return { ok: true };
    await this.requests.delete(requesterId, targetId);
    return { ok: true };
  }
}
