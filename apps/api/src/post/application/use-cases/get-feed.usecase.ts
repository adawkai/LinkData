import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';
import type { PostRepo } from '../ports/post-repo.port';
import { UserId } from '@/user/domain/value-object/user-id.vo';
import { PostEntityMapper } from '../ports/post.entity-mapper';
import { FeedResponseDTO } from '../../interface/dto/post.response.dto';

@Injectable()
export class GetFeedUseCase {
  constructor(
    @Inject(TOKENS.POST_REPO)
    private readonly postRepo: PostRepo,
  ) {}

  async execute(
    userId: UserId,
    pagination: {
      cursor?: string;
      take?: number;
    },
  ): Promise<FeedResponseDTO> {
    const { items, nextCursor } = await this.postRepo.feed(userId, pagination);
    return PostEntityMapper.toFeedDTO(items, nextCursor);
  }
}
