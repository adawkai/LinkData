import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';
import { assertCanBlock } from '../../domain/block.rules';
import type { BlockRepo } from '../port/block-repo';
import type { UserRepo } from '@/user/application/port/user.repo';
import { BlockTargetBodyDTO } from '../../interface/dto/block-target.body.dto';

// Errors
import { UserNotFoundError } from '@/user/domain/errors';
import { AlreadyBlockedError } from '@/block/domain/errors';
import { BlockEntity } from '@/block/domain/block.entity';
import { UserId } from '@/user/domain/value-object/user-id.vo';

@Injectable()
export class BlockUserUseCase {
  constructor(
    @Inject(TOKENS.BLOCK_REPO)
    private readonly blockRepo: BlockRepo,
    @Inject(TOKENS.USER_REPO)
    private readonly userRepo: UserRepo,
  ) {}

  async execute(blockerId: UserId, input: BlockTargetBodyDTO) {
    const targetId = UserId.from(input.targetId);

    // Validate users
    const blocker = await this.userRepo.findById(blockerId);
    if (!blocker) throw new UserNotFoundError();

    const targeter = await this.userRepo.findById(targetId);
    if (!targeter) throw new UserNotFoundError();

    assertCanBlock({ blocker, targeter });

    let block = await this.blockRepo.findBlockByBlockerIdAndBlockedId(
      blockerId,
      targetId,
    );

    if (block) throw new AlreadyBlockedError();

    block = BlockEntity.create({
      blockerId: blockerId,
      blockedId: targetId,
    });

    await this.blockRepo.create(block);
    return { ok: true };
  }
}
