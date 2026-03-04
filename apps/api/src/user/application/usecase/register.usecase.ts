import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';

// Ports
import type { UserRepoPort } from '../port/user.repo.port';
import { UserEntityDTOMapperPort } from '../port/user.mapper.port';
import {
  TOKEN_SIGNER,
  type TokenSigner,
} from '@/_shared/application/security/token.signer';
import {
  PASSWORD_HASHER,
  type PasswordHasher,
} from '@/_shared/application/security/password.hasher';

// Errors
import {
  EmailDuplicatedError,
  UsernameDuplicatedError,
} from '@/user/domain/errors';

// Entities, Value Objects, && DTOs
import { UserEntity } from '@/user/domain/entity/user.entity';
import { Username } from '@/user/domain/value-object/username.vo';
import { Email } from '@/user/domain/value-object/email.vo';
import { UserRegisterBodyDTO, UserRegisterResponseDTO } from '@social/shared';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(TOKENS.USER_REPO) private readonly userRepo: UserRepoPort,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasher,
    @Inject(TOKEN_SIGNER) private readonly signer: TokenSigner,
  ) {}

  async execute(input: UserRegisterBodyDTO): Promise<UserRegisterResponseDTO> {
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
      user: UserEntityDTOMapperPort.toDTO(user),
      accessToken,
    };
  }
}
