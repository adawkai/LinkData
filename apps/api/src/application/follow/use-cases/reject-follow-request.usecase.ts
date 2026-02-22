import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '../../tokens';
import type { FollowRequestRepoPort } from '../ports/follow-request-repo.port';
import type { FollowRequestDecisionInput } from '../models/follow.models';
import type { UserId } from '../../_shared/models/ids';

@Injectable()
export class RejectFollowRequestUseCase {
  constructor(
    @Inject(TOKENS.FOLLOW_REQUEST_REPO)
    private readonly requests: FollowRequestRepoPort,
  ) {}

  async execute(requestedId: UserId, input: FollowRequestDecisionInput) {
    await this.requests
      .delete(input.requesterId, requestedId)
      .catch(() => {});
    return { ok: true };
  }
}
