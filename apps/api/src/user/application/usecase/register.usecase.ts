import { Inject, Injectable } from '@nestjs/common';
import { ConflictError } from '@/_shared/domain/errors';
import { type UserRepo } from '../port/user.repo';
import {
  PASSWORD_HASHER,
  type PasswordHasher,
} from '@/_shared/application/security/password.hasher';
import {
  TOKEN_SIGNER,
  type TokenSigner,
} from '@/_shared/application/security/token.signer';
import { UserRegisterBodyDTO } from '../../interface/dto/user-register.body.dto';
import {
  UserRegisterResponseDTO,
  UserRegisterErrorResponseDTO,
} from '../../interface/dto/user-register.response.dto';
import { Username } from '../../domain/value-object/username.vo';
import { Email } from '../../domain/value-object/email.vo';
import {
  EmailDuplicatedError,
  InvalidEmailError,
  InvalidUsernameError,
  UsernameDuplicatedError,
} from '../../domain/errors';
import { UserEntity } from '../../domain/entity/user.entity';
import { TOKENS } from '@/_shared/application/tokens';

import { UserEntityMapper } from '../port/user.entity-mapper';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(TOKENS.USER_REPO) private readonly userRepo: UserRepo,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasher,
    @Inject(TOKEN_SIGNER) private readonly signer: TokenSigner,
  ) {}

  async execute(
    input: UserRegisterBodyDTO,
  ): Promise<UserRegisterResponseDTO | UserRegisterErrorResponseDTO> {
    const username = Username.create(input.username);
    const email = Email.create(input.email);
    if (await this.userRepo.findByEmail(email))
      throw new EmailDuplicatedError();
    if (await this.userRepo.findByUsername(username))
      throw new UsernameDuplicatedError();

    const password = await this.hasher.hash(input.password);

    const user: UserEntity = await UserEntity.create({
      name: input.name,
      email: email,
      username: username,
      passwordHash: password,
      role: 'USER',
      isPrivate: false,
      isActive: true,
    });
    await this.userRepo.upsert(user);

    const accessToken = await this.signer.signAccessToken({
      sub: user.id.toString(),
      username: user.username.toString(),
      role: user.role,
    });
    return {
      user: UserEntityMapper.toDTO(user),
      accessToken,
    };
  }
}
