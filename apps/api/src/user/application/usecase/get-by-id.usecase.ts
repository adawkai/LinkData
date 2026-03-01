import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/_shared/application/tokens';
import { type UserRepo } from '../port/user.repo';
import { UserEntityMapper } from '../port/user.entity-mapper';
import { UserNotFoundError } from '@/user/domain/errors';
import { UserId } from '@/user/domain/value-object/user-id.vo';

@Injectable()
export class GetByIdUseCase {
  constructor(@Inject(TOKENS.USER_REPO) private readonly users: UserRepo) {}

  async execute(userId: UserId) {
    const user = await this.users.findById(userId);
    if (!user) throw new UserNotFoundError();
    return UserEntityMapper.toDTO(user);
  }
}
