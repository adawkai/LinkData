import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/_shared/application/tokens';

// Ports
import type { UserRepoPort } from '../port/user.repo.port';
import { UserEntityDTOMapperPort } from '../port/user.entity-mapper.port';

// Errors
import { UserNotFoundError } from '@/user/domain/errors';

// Entities, Value Objects, && DTOs
import { UserId } from '@/user/domain/value-object/user-id.vo';
import { UserResponseDTO } from '@social/shared';

@Injectable()
export class GetByIdUseCase {
  constructor(@Inject(TOKENS.USER_REPO) private readonly users: UserRepoPort) {}

  async execute(userId: UserId): Promise<UserResponseDTO> {
    const user = await this.users.findById(userId);
    if (!user) throw new UserNotFoundError();
    return UserEntityDTOMapperPort.toDTO(user);
  }
}
