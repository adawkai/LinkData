import { Inject, Injectable } from '@nestjs/common';

import { type UserRepo } from '../port/user.repo';
import { UserLoginBodyDTO } from '../../interface/dto/user-login.body.dto';
import {
  UserLoginErrorResponseDTO,
  UserLoginResponseDTO,
} from '../../interface/dto/user-login.response.dto';
import { Email } from '../../domain/value-object/email.vo';
import {
  InvalidCredentialsError,
  UserInactiveError,
  UserNotFoundError,
} from '../../domain/errors';
import {
  type TokenSigner,
  TOKEN_SIGNER,
} from '@/_shared/application/security/token.signer';
import {
  PASSWORD_HASHER,
  type PasswordHasher,
} from '@/_shared/application/security/password.hasher';
import { TOKENS } from '@/_shared/application/tokens';
import { Username } from '@/user/domain/value-object/username.vo';

import { UserEntityMapper } from '../port/user.entity-mapper';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(TOKENS.USER_REPO) private readonly userRepo: UserRepo,
    @Inject(TOKEN_SIGNER) private readonly signer: TokenSigner,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasher,
  ) {}

  async execute(
    input: UserLoginBodyDTO,
  ): Promise<UserLoginResponseDTO | UserLoginErrorResponseDTO> {
    const isEmail = Email.isValid(input.usernameOrEmail);
    const user = isEmail
      ? await this.userRepo.findByEmail(Email.create(input.usernameOrEmail))
      : await this.userRepo.findByUsername(
          Username.create(input.usernameOrEmail),
        );

    if (!user) throw new UserNotFoundError();
    if (!user.isActive) throw new UserInactiveError();

    const ok = await this.hasher.compare(input.password, user.passwordHash);
    if (!ok) throw new InvalidCredentialsError();

    const accessToken = await this.signer.signAccessToken({
      sub: user.id.toString(),
      username: user.username.toString(),
      role: user.role,
    });
    return {
      accessToken,
      user: UserEntityMapper.toDTO(user),
    };
  }
}
