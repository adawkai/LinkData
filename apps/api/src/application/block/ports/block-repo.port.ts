import { BlockKey } from 'src/application/_shared/models/ids';

export interface BlockRepoPort {
  exists(params: BlockKey): Promise<boolean>;
  blockTx(params: BlockKey): Promise<void>;
  unblock(params: BlockKey): Promise<void>;
}
