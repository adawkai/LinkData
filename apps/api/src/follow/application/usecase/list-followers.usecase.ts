import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';

// Ports
import type { FollowRepoPort } from '../ports/follow.repo.port';
import { UserEntityDTOMapperPort } from '@/user/application/port/user.entity-mapper.port';

// Entities, Value Objects, && DTOs
import { UserId } from '@/user/domain/value-object/user-id.vo';
import { ListUserResponseDTO } from '@social/shared';

@Injectable()
export class ListFollowersUseCase {
  constructor(
    @Inject(TOKENS.FOLLOW_REPO) private readonly follows: FollowRepoPort,
  ) {}

  async execute(
    userId: UserId,
    pagination?: { cursor?: string; take?: number },
  ): Promise<ListUserResponseDTO> {
    const { items, nextCursor } = await this.follows.listFollowers(
      userId,
      pagination,
    );

    return UserEntityDTOMapperPort.toListDTO(items, nextCursor);
  }
}
