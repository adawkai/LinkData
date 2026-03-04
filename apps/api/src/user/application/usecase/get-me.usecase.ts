import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';

// Ports
import type { UserRepoPort } from '../port/user.repo.port';
import { UserEntityDTOMapperPort } from '../port/user.mapper.port';

// Errors
import { UserNotFoundError } from '@/user/domain/errors';

// Entities, Value Objects, && DTOs
import { UserId } from '@/user/domain/value-object/user-id.vo';

@Injectable()
export class GetMeUseCase {
  constructor(@Inject(TOKENS.USER_REPO) private readonly users: UserRepoPort) {}

  async execute(userId: UserId) {
    const me = await this.users.findById(userId);
    if (!me) throw new UserNotFoundError();
    return UserEntityDTOMapperPort.toDTO(me);
  }
}
