import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '../../tokens';
import type { UserReadRepoPort } from '../ports/user-read-repo.port';
import type { UpdatePrivacyInput } from '../models/user.models';
import type { UserId } from '../../_shared/models/ids';

@Injectable()
export class UpdatePrivacyUseCase {
  constructor(
    @Inject(TOKENS.USER_READ_REPO) private readonly users: UserReadRepoPort,
  ) {}

  async execute(userId: UserId, input: UpdatePrivacyInput) {
    await this.users.setPrivacy(userId, input.isPrivate);
    return { ok: true };
  }
}
