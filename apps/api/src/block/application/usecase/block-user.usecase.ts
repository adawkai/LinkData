import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';

// Ports
import type { BlockRepoPort } from '@/block/application/port/block.repo.port';
import type { UserRepoPort } from '@/user/application/port/user.repo.port';

// Errors
import { UserNotFoundError } from '@/user/domain/errors';
import {
  AlreadyBlockedError,
  CannotBlockYourselfError,
} from '@/block/domain/errors';

// Entities, Value Objects, && DTOs
import { BlockEntity } from '@/block/domain/block.entity';
import { UserId } from '@/user/domain/value-object/user-id.vo';
import { BlockTargetBodyDTO, BlockTargetResponseDTO } from '@social/shared';

@Injectable()
export class BlockUserUseCase {
  constructor(
    @Inject(TOKENS.BLOCK_REPO)
    private readonly blockRepo: BlockRepoPort,
    @Inject(TOKENS.USER_REPO)
    private readonly userRepo: UserRepoPort,
  ) {}

  async execute(
    blockerId: UserId,
    input: BlockTargetBodyDTO,
  ): Promise<BlockTargetResponseDTO> {
    const targetId = UserId.from(input.targetId);

    // Validate users
    const blocker = await this.userRepo.findById(blockerId);
    if (!blocker) throw new UserNotFoundError();

    const targeter = await this.userRepo.findById(targetId);
    if (!targeter) throw new UserNotFoundError();

    if (blocker.id === targeter.id) {
      throw new CannotBlockYourselfError();
    }

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
