import type { Role } from '../../_shared/models/role';
import type { UserId } from '../../_shared/models/ids';

export type AuthUserRecord = {
  id: UserId;
  email: string;
  username: string;
  password: string;
  role: Role;
  isActive: boolean;
};

export type AuthUserPublic = {
  id: UserId;
  email: string;
  username: string;
  role: Role;
};

export type RegisterInput = {
  email: string;
  username: string;
  password: string;
};

export type LoginInput = {
  usernameOrEmail: string;
  password: string;
};

export type AuthResponse = {
  user: AuthUserPublic;
  accessToken: string;
};
