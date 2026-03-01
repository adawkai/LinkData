import { UserEntity } from '../entity/user.entity';
import { UserBlockedError, UserInactiveError } from '../errors';

export function assertUserIsActive(user: UserEntity) {
  if (!user.isActive) {
    throw new UserInactiveError();
  }
}

export function assertNotBlocked(blockedEitherDirection: boolean) {
  if (blockedEitherDirection) {
    throw new UserBlockedError();
  }
}
