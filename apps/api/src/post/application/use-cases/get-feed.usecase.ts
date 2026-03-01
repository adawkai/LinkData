import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';
import type { PostRepo } from '../ports/post-repo.port';
import { UserId } from '@/user/domain/value-object/user-id.vo';
import { PostEntity } from '@/post/domain/post.entity';

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
  ): Promise<{ items: PostEntity[]; nextCursor: string | null }> {
    return await this.postRepo.feed(userId, pagination);
  }
}
