import { UserEntity } from '@/user/domain/entity/user.entity';
import { CannotBlockYourselfError } from './errors';

export function assertCanBlock(params: {
  blocker: UserEntity;
  targeter: UserEntity;
}) {
  if (params.blocker.id === params.targeter.id) {
    throw new CannotBlockYourselfError();
  }
}
