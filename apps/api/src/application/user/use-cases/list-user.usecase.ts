import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '../../tokens';
import type { UserReadRepoPort } from '../ports/user-read-repo.port';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(TOKENS.USER_READ_REPO) private readonly users: UserReadRepoPort,
  ) {}

  async execute(query: string, cursor?: string, take?: number) {
    return this.users.listUsers(query, cursor, take);
  }
}
