import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/_shared/application/tokens';
import { type UserRepo } from '../port/user.repo';
import { UserNotFoundError } from '@/user/domain/errors';
import { UserId } from '@/user/domain/value-object/user-id.vo';
import { UserResponseDTO } from '../../interface/dto/user.response.dto';
import { UserEntityMapper } from '../port/user.entity-mapper';
import { UpdateProfileBodyDTO } from '../../interface/dto/update-profile.body.dto';

@Injectable()
export class UpdateMyProfileUseCase {
  constructor(@Inject(TOKENS.USER_REPO) private readonly users: UserRepo) {}

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

    return UserEntityMapper.toDTO(user);
  }
}
