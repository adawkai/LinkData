import {
  ConflictError,
  DatabaseError,
  NotFoundError,
} from '@/_shared/domain/errors';

export const FollowErrorCode = {
  FOLLOW_NOT_FOUND: 'FOLLOW_NOT_FOUND',
  FOLLOW_REQUEST_NOT_FOUND: 'FOLLOW_REQUEST_NOT_FOUND',
  ALREADY_FOLLOWED: 'ALREADY_FOLLOWED',
  USER_IS_PRIVATE: 'USER_IS_PRIVATE',
  FOLLOW_DATABASE_ERROR: 'FOLLOW_DATABASE_ERROR',
  FOLLOW_REQUEST_DATABASE_ERROR: 'FOLLOW_REQUEST_DATABASE_ERROR',
} as const;

export type FollowErrorCode =
  (typeof FollowErrorCode)[keyof typeof FollowErrorCode];

export class FollowRequestNotFoundError extends NotFoundError {
  constructor() {
    super({
      code: FollowErrorCode.FOLLOW_REQUEST_NOT_FOUND,
      message: 'Follow request not found',
    });
  }
}

export class FollowNotFoundError extends NotFoundError {
  constructor() {
    super({
      code: FollowErrorCode.FOLLOW_NOT_FOUND,
      message: 'Follow not found',
    });
  }
}

export class AlreadyFollowedError extends ConflictError {
  constructor() {
    super({
      code: FollowErrorCode.ALREADY_FOLLOWED,
      message: 'Already followed',
    });
  }
}

export class UserIsPrivateError extends ConflictError {
  constructor() {
    super({
      code: FollowErrorCode.USER_IS_PRIVATE,
      message: 'User is private',
    });
  }
}

export class FollowDatabaseError extends DatabaseError {
  constructor() {
    super({
      code: FollowErrorCode.FOLLOW_DATABASE_ERROR,
      message: 'Error while performing follow database operations',
    });
  }
}

export class FollowRequestDatabaseError extends DatabaseError {
  constructor() {
    super({
      code: FollowErrorCode.FOLLOW_REQUEST_DATABASE_ERROR,
      message: 'Error while performing follow request database operations',
    });
  }
}
