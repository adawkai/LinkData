import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '../../tokens';
import type { BlockRepoPort } from '../ports/block-repo.port';
import type { BlockTargetInput } from '../models/block.models';
import type { UserId } from '../../_shared/models/ids';

@Injectable()
export class UnblockUserUseCase {
  constructor(
    @Inject(TOKENS.BLOCK_REPO) private readonly blocks: BlockRepoPort,
  ) {}

  async execute(blockerId: UserId, input: BlockTargetInput) {
    await this.blocks.unblock({
      blockerId,
      blockedId: input.targetUserId,
    });
    return { ok: true };
  }
}
