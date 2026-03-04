import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';

// Ports
import type { UserRepoPort } from '../port/user.repo.port';
import { UserEntityDTOMapperPort } from '../port/user.mapper.port';

// Errors
import { UserNotFoundError } from '@/user/domain/errors';

// Entities, Value Objects, && DTOs
import { UserId } from '@/user/domain/value-object/user-id.vo';
import { UserResponseDTO, UpdateProfileBodyDTO } from '@social/shared';

@Injectable()
export class UpdateMyProfileUseCase {
  constructor(@Inject(TOKENS.USER_REPO) private readonly users: UserRepoPort) {}

  async execute(
    userId: UserId,
    dto: UpdateProfileBodyDTO,
  ): Promise<UserResponseDTO> {
    const user = await this.users.findById(userId);
    if (!user) throw new UserNotFoundError();

    if (dto.name !== undefined) {
      user.name = dto.name;
    }

    if (dto.isPrivate !== undefined) {
      await user.update({ isPrivate: dto.isPrivate });
    }

    user.profile.update({
      title: dto.title,
      company: dto.company,
      bio: dto.bio,
      gender: dto.gender,
      website: dto.website,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      location: dto.location,
      contact: dto.contact,
      avatarUrl: dto.avatarUrl,
    });

    await this.users.upsert(user);

    return UserEntityDTOMapperPort.toDTO(user);
  }
}
