import type { BlockKey } from '../../_shared/models/ids';

export type BlockRecord = BlockKey & {
  createdAt: Date;
};

export type BlockTargetInput = {
  targetUserId: string;
};
