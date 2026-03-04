import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';

// Ports
import type { PostRepoPort } from '../ports/post.repo.port';
import type { UserRepoPort } from '@/user/application/port/user.repo.port';

// Errors
import { UserInactiveError, UserNotFoundError } from '@/user/domain/errors';
import { PostEntityDTOMapperPort } from '../ports/post.entity-mapper.dto';

// Entities, Value Objects, && DTOs
import { UserId } from '@/user/domain/value-object/user-id.vo';
import { CreatePostBodyDTO, CreatePostResponseDTO } from '@social/shared';
import { PostEntity } from '@/post/domain/post.entity';

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject(TOKENS.POST_REPO)
    private readonly postRepo: PostRepoPort,
    @Inject(TOKENS.USER_REPO)
    private readonly userRepo: UserRepoPort,
  ) {}

  async execute(
    authorId: UserId,
    input: CreatePostBodyDTO,
  ): Promise<CreatePostResponseDTO> {
    const user = await this.userRepo.findById(authorId);

    if (!user) throw new UserNotFoundError();
    if (!user.isActive) throw new UserInactiveError();

    const post = PostEntity.create({
      author: user,
      content: input.content,
    });

    await this.postRepo.create(post);

    return {
      ok: true,
      post: PostEntityDTOMapperPort.toDTO(post),
    };
  }
}
