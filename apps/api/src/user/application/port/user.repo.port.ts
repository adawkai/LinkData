import { UserId } from '@/user/domain/value-object/user-id.vo';
import { UserEntity } from '@/user/domain/entity/user.entity';
import { Email } from '@/user/domain/value-object/email.vo';
import { Username } from '@/user/domain/value-object/username.vo';

export type UpsertUserType =
  | 'USER_AND_PROFILE'
  | 'USER_ONLY'
  | 'PROFILE_ONLY'
  | 'NONE';

export interface UserRepoPort {
  upsert(user: UserEntity, type?: UpsertUserType): Promise<void>;
  findById(id: UserId): Promise<UserEntity | null>;
  findByEmail(email: Email): Promise<UserEntity | null>;
  findByUsername(username: Username): Promise<UserEntity | null>;
  list(params: {
    query?: string;
    pagination?: { cursor?: string; take?: number };
  }): Promise<{ items: UserEntity[]; nextCursor: string | null }>;
  delete(id: UserId): Promise<void>;
  existsById(id: UserId): Promise<boolean>;
}
