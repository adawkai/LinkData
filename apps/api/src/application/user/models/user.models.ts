import type { Role } from '../../_shared/models/role';
import type { UserId } from '../../_shared/models/ids';

export type UserMe = {
  id: UserId;
  email: string;
  username: string;
  role: Role;

  isPrivate: boolean;
  isActive: boolean;

  postCount: number;
  followersCount: number;
  followingCount: number;
};

export type UpdatePrivacyInput = {
  isPrivate: boolean;
};
