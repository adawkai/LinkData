export type CursorPageRequest = {
  cursor?: string; // typically a post id or createdAt cursor encoded
  limit?: number; // default in use case
};

export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};
