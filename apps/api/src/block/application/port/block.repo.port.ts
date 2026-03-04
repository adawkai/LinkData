import { BlockEntity } from '@/block/domain/block.entity';
import { UserId } from '@/user/domain/value-object/user-id.vo';

export interface BlockRepoPort {
  create(block: BlockEntity): Promise<void>;
  delete(block: BlockEntity): Promise<void>;
  findBlockByBlockerIdAndBlockedId(
    blockerId: UserId,
    blockedId: UserId,
  ): Promise<BlockEntity | null>;
}
