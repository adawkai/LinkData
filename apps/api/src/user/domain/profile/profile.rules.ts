import { ValidationError } from '@/_shared/domain/errors';
import { UserErrorCode } from '../errors';

export function validateProfileName(name: string | null | undefined) {
  if (!name) return;
  if (name.length > 50)
    throw new ValidationError({
      code: UserErrorCode.PROFILE_NAME_TOO_LONG,
      message: 'Profile name too long',
      status: 400,
    });
}

export function validateAvatarUrl(url: string | null | undefined) {
  if (!url) return;
  if (url.length > 2048)
    throw new ValidationError({
      code: UserErrorCode.AVATAR_URL_TOO_LONG,
      message: 'Avatar URL too long',
      status: 400,
    });
  // optional: basic check
  if (!/^https?:\/\//.test(url))
    throw new ValidationError({
      code: UserErrorCode.AVATAR_URL_INVALID,
      message: 'Avatar URL must be http(s)',
      status: 400,
    });
}
