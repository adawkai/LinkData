import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '@/_shared/domain/errors';

export const UserErrorCode = {
  USER_INACTIVE: 'USER_INACTIVE',
  USER_BLOCKED: 'USER_BLOCKED',
  EMAIL_DUPICATED: 'EMAIL_DUPLICATED',
  USERNAME_DUPLICATED: 'USERNAME_DUPLICATED',
  PRIVATE_ACCOUNT: 'PRIVATE_ACCOUNT',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_USERNAME: 'INVALID_USERNAME',
  PROFILE_NAME_TOO_LONG: 'PROFILE_NAME_TOO_LONG',
  AVATAR_URL_TOO_LONG: 'AVATAR_URL_TOO_LONG',
  AVATAR_URL_INVALID: 'AVATAR_URL_INVALID',
  USER_ID_INVALID: 'USER_ID_INVALID',
} as const;

export type UserErrorCode = (typeof UserErrorCode)[keyof typeof UserErrorCode];

export class UserInactiveError extends ForbiddenError {
  constructor() {
    super({
      code: UserErrorCode.USER_INACTIVE,
      message: 'User is inactive',
    });
  }
}

export class EmailDuplicatedError extends ConflictError {
  constructor() {
    super({
      code: UserErrorCode.EMAIL_DUPICATED,
      message: 'Email is duplicated',
    });
  }
}

export class UsernameDuplicatedError extends ConflictError {
  constructor() {
    super({
      code: UserErrorCode.USERNAME_DUPLICATED,
      message: 'Username is duplicated',
    });
  }
}

export class UserBlockedError extends ForbiddenError {
  constructor() {
    super({
      code: UserErrorCode.USER_BLOCKED,
      message: 'User is blocked',
    });
  }
}

export class UserPrivateAccountError extends ForbiddenError {
  constructor() {
    super({
      code: UserErrorCode.PRIVATE_ACCOUNT,
      message: 'User is private',
    });
  }
}

export class UserNotFoundError extends NotFoundError {
  constructor() {
    super({
      code: UserErrorCode.USER_NOT_FOUND,
      message: 'User not found',
    });
  }
}

export class InvalidCredentialsError extends UnauthorizedError {
  constructor() {
    super({
      code: UserErrorCode.INVALID_CREDENTIALS,
      message: 'Invalid credentials',
    });
  }
}

export class InvalidEmailError extends ValidationError {
  constructor() {
    super({
      code: UserErrorCode.INVALID_EMAIL,
      message: 'Invalid email',
    });
  }
}

export class InvalidUsernameError extends ValidationError {
  constructor() {
    super({
      code: UserErrorCode.INVALID_USERNAME,
      message: 'Invalid username',
    });
  }
}

export class UserIdInvalidError extends ValidationError {
  constructor() {
    super({
      code: UserErrorCode.USER_ID_INVALID,
      message: 'Invalid user id',
    });
  }
}
