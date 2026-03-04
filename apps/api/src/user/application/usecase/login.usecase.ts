import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';

// Ports
import type { UserRepoPort } from '../port/user.repo.port';
import { UserEntityDTOMapperPort } from '../port/user.entity-mapper.port';
import {
  type TokenSigner,
  TOKEN_SIGNER,
} from '@/_shared/application/security/token.signer';
import {
  PASSWORD_HASHER,
  type PasswordHasher,
} from '@/_shared/application/security/password.hasher';

// Errors
import {
  InvalidCredentialsError,
  UserInactiveError,
  UserNotFoundError,
} from '@/user/domain/errors';

// Entities, Value Objects, && DTOs
import { Email } from '@/user/domain/value-object/email.vo';
import { Username } from '@/user/domain/value-object/username.vo';
import { UserLoginBodyDTO, UserLoginResponseDTO } from '@social/shared';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(TOKENS.USER_REPO) private readonly userRepo: UserRepoPort,
    @Inject(TOKEN_SIGNER) private readonly signer: TokenSigner,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasher,
  ) {}

  async execute(input: UserLoginBodyDTO): Promise<UserLoginResponseDTO> {
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
      user: UserEntityDTOMapperPort.toDTO(user),
    };
  }
}
