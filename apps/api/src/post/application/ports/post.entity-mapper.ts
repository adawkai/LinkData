import { PostEntity } from '../../domain/post.entity';
import { PostResponseDTO } from '../../interface/dto/post.response.dto';
import { UserEntityMapper } from '@/user/application/port/user.entity-mapper';

export class PostEntityMapper {
  static toDTO(post: PostEntity): PostResponseDTO {
    if (!post.author) {
      throw new Error('Post author must be populated to map to DTO');
    }

    return {
      id: post.id.toString(),
      authorId: post.authorId.toString(),
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: UserEntityMapper.toDTO(post.author),
    };
  }

  static toFeedDTO(posts: PostEntity[], nextCursor: string | null) {
    return {
      items: posts.map((p) => this.toDTO(p)),
      nextCursor,
    };
  }
}
