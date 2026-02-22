import type { UserId, ProfileId } from '../../_shared/models/ids';

export type ProfileRecord = {
  id: ProfileId;
  userId: UserId;
  name: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// what API returns for /profiles/:userId
export type ProfileView = {
  userId: UserId;
  name: string | null;
  avatarUrl: string | null;
};

// input for updating profile
export type UpdateProfileInput = {
  name?: string | null;
  avatarUrl?: string | null;
};
