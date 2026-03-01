import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/_shared/application/tokens';
import type { PostRepo } from '../ports/post-repo.port';
import { UserId } from '@/user/domain/value-object/user-id.vo';
import type { UserRepo } from '@/user/application/port/user.repo';
import { UserInactiveError, UserNotFoundError } from '@/user/domain/errors';
import type { CreatePostBodyDTO } from '@/post/interface/dto/create-post.body.dto';
import { PostEntity } from '@/post/domain/post.entity';
import { PostEntityMapper } from '../ports/post.entity-mapper';
import { CreatePostResponseDTO } from '../../interface/dto/create-post.response.dto';

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject(TOKENS.POST_REPO)
    private readonly postRepo: PostRepo,
    @Inject(TOKENS.USER_REPO)
    private readonly userRepo: UserRepo,
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
      post: PostEntityMapper.toDTO(post),
    };
  }
}
