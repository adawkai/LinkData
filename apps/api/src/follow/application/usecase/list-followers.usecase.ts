import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';
import { type FollowRepo } from '../ports/follow-repo.port';
import { UserId } from '@/user/domain/value-object/user-id.vo';
import { UserEntityMapper } from '@/user/application/port/user.entity-mapper';

@Injectable()
export class ListFollowersUseCase {
  constructor(
    @Inject(TOKENS.FOLLOW_REPO) private readonly follows: FollowRepo,
  ) {}

  async execute(
    userId: UserId,
    pagination?: { cursor?: string; take?: number },
  ) {
    const { items, nextCursor } = await this.follows.listFollowers(
      userId,
      pagination,
    );

    return {
      items: items.map((u) => UserEntityMapper.toDTO(u)),
      nextCursor,
    };
  }
}
