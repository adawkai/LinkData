import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/_shared/application/tokens';
import { type UserRepo } from '../port/user.repo';
import { UserEntityMapper } from '../port/user.entity-mapper';

@Injectable()
export class ListUserUseCase {
  constructor(@Inject(TOKENS.USER_REPO) private readonly users: UserRepo) {}

  async execute(pagination: { cursor?: string; take: number }, query?: string) {
    const { items, nextCursor } = await this.users.list({ query, pagination });
    return {
      items: items.map((user) => UserEntityMapper.toDTO(user)),
      nextCursor,
    };
  }
}
