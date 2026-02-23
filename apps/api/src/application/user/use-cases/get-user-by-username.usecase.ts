import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '../../tokens';
import { NotFoundError } from '../../../domain/common/errors';
import type { UserReadRepoPort } from '../ports/user-read-repo.port';
import type { UserSummaryRes } from '../../_shared/models/user-summary';

@Injectable()
export class GetUserByUsernameUseCase {
  constructor(
    @Inject(TOKENS.USER_READ_REPO) private readonly users: UserReadRepoPort,
  ) {}

  async execute(username: string): Promise<UserSummaryRes> {
    const user = await this.users.getByUsername(username);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }
}

