import {
  NotFoundError,
  ValidationError,
  DatabaseError,
} from '@/_shared/domain/errors';

export const PostErrorCode = {
  POST_NOT_FOUND: 'POST_NOT_FOUND',
  POST_ID_INVALID: 'POST_ID_INVALID',
  POST_DATABASE_ERROR: 'POST_DATABASE_ERROR',
};

export type PostErrorCode = (typeof PostErrorCode)[keyof typeof PostErrorCode];

export class PostIdInvalidError extends ValidationError {
  constructor() {
    super({
      code: PostErrorCode.POST_ID_INVALID,
      message: 'Post ID is invalid',
    });
  }
}

export class PostDatabaseError extends DatabaseError {
  constructor() {
    super({
      code: PostErrorCode.POST_DATABASE_ERROR,
      message: 'Post database error',
    });
  }
}

export class PostNotFoundError extends NotFoundError {
  constructor() {
    super({
      code: PostErrorCode.POST_NOT_FOUND,
      message: 'Post not found',
    });
  }
}
