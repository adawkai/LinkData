import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';

// Ports
import type { PostRepoPort } from '../ports/post.repo.port';
import { PostEntityDTOMapperPort } from '../ports/post.entity-mapper.dto';

// Entities, Value Objects, && DTOs
import { UserId } from '@/user/domain/value-object/user-id.vo';
import { PostListResponseDTO } from '@social/shared';

@Injectable()
export class GetFeedUseCase {
  constructor(
    @Inject(TOKENS.POST_REPO)
    private readonly postRepo: PostRepoPort,
  ) {}

  async execute(
    userId: UserId,
    pagination: {
      cursor?: string;
      take?: number;
    },
  ): Promise<PostListResponseDTO> {
    const { items, nextCursor } = await this.postRepo.feed(userId, pagination);
    return PostEntityDTOMapperPort.toFeedDTO(items, nextCursor);
  }
}
