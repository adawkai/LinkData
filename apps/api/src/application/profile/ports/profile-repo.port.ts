import type { UserId } from '../../_shared/models/ids';
import type { ProfileView, UpdateProfileInput } from '../models/profile.models';

export interface ProfileRepoPort {
  getByUserId(userId: UserId): Promise<ProfileView | null>;
  upsertByUserId(
    userId: UserId,
    data: UpdateProfileInput,
  ): Promise<ProfileView>;
}
