import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/_shared/application/tokens';
import { type UserRepo } from '../port/user.repo';

@Injectable()
export class ListUserUseCase {
  constructor(@Inject(TOKENS.USER_REPO) private readonly users: UserRepo) {}

  async execute(
    query?: string,
    pagination?: { cursor?: string; take?: number },
  ) {
    return this.users.list({ query, pagination });
  }
}
