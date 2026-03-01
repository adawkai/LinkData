import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/_shared/application/tokens';
import { type UserRepo } from '../port/user.repo';
import { UserEntityMapper } from '../port/user.entity-mapper';
import { UserNotFoundError } from '@/user/domain/errors';
import { Username } from '@/user/domain/value-object/username.vo';

@Injectable()
export class GetByUserNameUseCase {
  constructor(@Inject(TOKENS.USER_REPO) private readonly users: UserRepo) {}

  async execute(username: Username) {
    const me = await this.users.findByUsername(username);
    if (!me) throw new UserNotFoundError();
    return UserEntityMapper.toDTO(me);
  }
}
