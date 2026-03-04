import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';

// Ports
import type { UserRepoPort } from '../port/user.repo.port';
import { UserEntityDTOMapperPort } from '../port/user.entity-mapper.port';

// Entities, Value Objects, && DTOs
import { ListUserResponseDTO } from '@social/shared';

@Injectable()
export class ListUserUseCase {
  constructor(@Inject(TOKENS.USER_REPO) private readonly users: UserRepoPort) {}

  async execute(
    pagination: { cursor?: string; take: number },
    query?: string,
  ): Promise<ListUserResponseDTO> {
    const { items, nextCursor } = await this.users.list({ query, pagination });
    return {
      items: items.map((user) => UserEntityDTOMapperPort.toDTO(user)),
      nextCursor,
    };
  }
}
