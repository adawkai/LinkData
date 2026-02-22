import type { PostId, UserId } from '../../_shared/models/ids';
import type { FeedItem, PostRecord } from '../models/post.models';

export interface PostRepoPort {
  createPostTx(
    authorId: UserId,
    content: string,
  ): Promise<Pick<PostRecord, 'id' | 'content' | 'createdAt'>>;
  feed(userId: UserId): Promise<FeedItem[]>;
}
