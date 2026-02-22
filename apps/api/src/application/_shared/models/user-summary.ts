import type { Role } from './role';
import type { UserId } from './ids';

export type UserSummary = {
  id: UserId;
  username: string;
  role: Role;
  isPrivate: boolean;
  isActive: boolean;

  name: string | null;
  avatarUrl: string | null;

  followersCount: number;
  followingCount: number;
  postCount: number;
};
