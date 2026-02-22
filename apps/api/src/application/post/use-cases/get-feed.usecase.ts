import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '../../tokens';
import type { PostRepoPort } from '../ports/post-repo.port';
import type { FeedItem } from '../models/post.models';
import type { UserId } from '../../_shared/models/ids';

@Injectable()
export class GetFeedUseCase {
  constructor(
    @Inject(TOKENS.POST_REPO)
    private readonly posts: PostRepoPort,
  ) {}

  execute(userId: UserId): Promise<FeedItem[]> {
    return this.posts.feed(userId);
  }
}
