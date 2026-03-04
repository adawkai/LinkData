import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';

// Ports
import type { BlockRepoPort } from '../port/block.repo.port';
import type { UserRepoPort } from '@/user/application/port/user.repo.port';

// Errors
import { UserNotFoundError } from '@/user/domain/errors';
import { BlockNotFoundError } from '@/block/domain/errors';

// Entities, Value Objects, && DTOs
import { BlockEntity } from '@/block/domain/block.entity';
import { UserId } from '@/user/domain/value-object/user-id.vo';
import { UnBlockTargetBodyDTO, UnBlockTargetResponseDTO } from '@social/shared';

@Injectable()
export class UnblockUserUseCase {
  constructor(
    @Inject(TOKENS.BLOCK_REPO)
    private readonly blockRepo: BlockRepoPort,
    @Inject(TOKENS.USER_REPO)
    private readonly userRepo: UserRepoPort,
  ) {}

  async execute(
    blockerId: UserId,
    input: UnBlockTargetBodyDTO,
  ): Promise<UnBlockTargetResponseDTO> {
    const targetId = UserId.from(input.targetId);

    const blocker = await this.userRepo.findById(blockerId);
    if (!blocker) throw new UserNotFoundError();

    const target = await this.userRepo.findById(targetId);
    if (!target) throw new UserNotFoundError();

    let block: BlockEntity | null =
      await this.blockRepo.findBlockByBlockerIdAndBlockedId(
        blockerId,
        targetId,
      );
    if (!block) throw new BlockNotFoundError();

    await this.blockRepo.delete(block);
    return { ok: true };
  }
}
