import {
  ConflictError,
  DatabaseError,
  NotFoundError,
  ValidationError,
} from '@/_shared/domain/errors';

export const BlockErrorCode = {
  ALREADY_BLOCKED: 'ALREADY_BLOCKED',
  CANNOT_BLOCK_YOURSELF: 'CANNOT_BLOCK_YOURSELF',
  BLOCK_DATABASE_ERROR: 'BLOCK_DATABASE_ERROR',
  BLOCK_NOT_FOUND: 'BLOCK_NOT_FOUND',
} as const;

export type BlockErrorCode =
  (typeof BlockErrorCode)[keyof typeof BlockErrorCode];

export class AlreadyBlockedError extends ConflictError {
  constructor() {
    super({
      code: BlockErrorCode.ALREADY_BLOCKED,
      message: 'Already blocked',
    });
  }
}

export class CannotBlockYourselfError extends ValidationError {
  constructor() {
    super({
      code: BlockErrorCode.CANNOT_BLOCK_YOURSELF,
      message: 'You cannot block yourself',
    });
  }
}

export class BlockDatabaseError extends DatabaseError {
  constructor() {
    super({
      code: BlockErrorCode.BLOCK_DATABASE_ERROR,
      message: 'Error while performing block database operations',
    });
  }
}

export class BlockNotFoundError extends NotFoundError {
  constructor() {
    super({
      code: BlockErrorCode.BLOCK_NOT_FOUND,
      message: 'Block not found',
    });
  }
}
