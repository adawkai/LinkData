import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';
import type { BlockRepo } from '../port/block-repo';
import type { UserRepo } from '@/user/application/port/user.repo';
import { UnBlockTargetBodyDTO } from '../../interface/dto/block-target.body.dto';
import { UserNotFoundError } from '@/user/domain/errors';
import { UnBlockTargetResponseDTO } from '@/block/interface/dto/block-target.response.dto';
import { BlockNotFoundError } from '@/block/domain/errors';
import { UserId } from '@/user/domain/value-object/user-id.vo';

@Injectable()
export class UnblockUserUseCase {
  constructor(
    @Inject(TOKENS.BLOCK_REPO)
    private readonly blockRepo: BlockRepo,
    @Inject(TOKENS.USER_REPO)
    private readonly userRepo: UserRepo,
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

    let block = await this.blockRepo.findBlockByBlockerIdAndBlockedId(
      blockerId,
      targetId,
    );
    if (!block) throw new BlockNotFoundError();

    await this.blockRepo.delete(block);
    return { ok: true };
  }
}
