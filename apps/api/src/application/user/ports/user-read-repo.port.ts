import type { UserId } from '../../_shared/models/ids';
import type { UserMeRes } from '@social/shared';
import type { UserSummaryRes } from '../../_shared/models/user-summary';

export interface UserReadRepoPort {
  getMe(userId: UserId): Promise<UserMeRes | null>;
  listUsers(
    query: string,
    cursor?: string,
    take?: number,
  ): Promise<{ items: UserSummaryRes[]; nextCursor: string | null }>;
  getByUsername(username: string): Promise<UserSummaryRes | null>;
  setPrivacy(userId: UserId, isPrivate: boolean): Promise<void>;
}
