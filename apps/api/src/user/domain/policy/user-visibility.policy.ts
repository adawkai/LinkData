import { UserEntity } from '../entity/user.entity';
import { UserPrivateAccountError } from '../errors';

export function assertCanViewPrivateAccount(params: {
  viewer: UserEntity | null;
  target: UserEntity;
}) {
  const { viewer, target } = params;

  if (!viewer && target.isPrivate) {
    throw new UserPrivateAccountError();
  }
}
