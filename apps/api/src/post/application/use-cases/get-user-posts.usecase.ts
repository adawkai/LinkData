import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';
import { type PostRepo } from '../ports/post-repo.port';
import { UserId } from '@/user/domain/value-object/user-id.vo';
import { PostEntityMapper } from '../ports/post.entity-mapper';

@Injectable()
export class GetUserPostsUseCase {
  constructor(@Inject(TOKENS.POST_REPO) private readonly posts: PostRepo) {}

  async execute(
    userId: UserId,
    pagination?: { cursor?: string; take?: number },
  ) {
    const { items, nextCursor } = await this.posts.findByAuthorId(
      userId,
      pagination,
    );

    return {
      items: items.map((p) => PostEntityMapper.toDTO(p)),
      nextCursor,
    };
  }
}
