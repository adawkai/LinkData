import type { PostId, UserId } from '../../_shared/models/ids';

export type PostRecord = {
  id: PostId;
  authorId: UserId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePostInput = {
  content: string;
};

// Feed item model (what API returns in /posts/feed)
export type FeedItem = {
  id: PostId;
  authorId: UserId;
  username: string;
  content: string;
  createdAt: Date;
};
