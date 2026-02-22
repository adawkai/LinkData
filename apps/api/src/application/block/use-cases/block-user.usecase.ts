import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '../../tokens';
import { ConflictError } from '../../../domain/common/errors';
import { assertCanBlock } from '../../../domain/follow/follow.rules';
import type { BlockRepoPort } from '../ports/block-repo.port';
import type { BlockTargetInput } from '../models/block.models';
import type { UserId } from '../../_shared/models/ids';

@Injectable()
export class BlockUserUseCase {
  constructor(
    @Inject(TOKENS.BLOCK_REPO)
    private readonly blocks: BlockRepoPort,
  ) {}

  async execute(blockerId: UserId, input: BlockTargetInput) {
    const targetId = input.targetUserId;
    assertCanBlock({ blockerId, targetId });

    if (await this.blocks.exists({ blockerId, blockedId: targetId }))
      throw new ConflictError('Already blocked');
    await this.blocks.blockTx({ blockerId, blockedId: targetId });
    return { ok: true };
  }
}
