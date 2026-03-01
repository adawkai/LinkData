import type { User } from "../users/types";

export type Post = {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: User;
};

export type FeedResponse = {
  items: Post[];
  nextCursor: string | null;
};

export type CreatePostDto = {
  content: string;
};
