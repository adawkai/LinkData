import type { UserId } from '../../_shared/models/ids';
import type { UserMe } from '../models/user.models';

export interface UserReadRepoPort {
  getMe(userId: UserId): Promise<UserMe | null>;
  setPrivacy(userId: UserId, isPrivate: boolean): Promise<void>;
}
