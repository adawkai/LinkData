import {
  AuthUserPublic,
  AuthUserRecord,
  RegisterInput,
} from '../models/auth.models';

export interface UserAuthRepoPort {
  findByEmail(email: string): Promise<AuthUserRecord | null>;
  findByUsername(username: string): Promise<AuthUserRecord | null>;
  createUser(data: RegisterInput): Promise<AuthUserPublic>;
}
