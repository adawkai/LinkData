import { UserId } from '@/user/domain/value-object/user-id.vo';
import { PostId } from './post-id.vo';
import { UserEntity } from '@/user/domain/entity/user.entity';

export type UpdatePostProps = {
  content: string;
};

export class PostEntity {
  constructor(
    public readonly id: PostId,
    public readonly authorId: UserId,
    public content: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public author?: UserEntity,
  ) {}

  static create(params: { author: UserEntity; content: string }) {
    return new PostEntity(
      PostId.create(),
      params.author.id,
      params.content,
      new Date(),
      new Date(),
      params.author,
    );
  }

  static rehydrate(params: {
    id: string;
    authorId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    author?: UserEntity;
  }) {
    return new PostEntity(
      PostId.from(params.id),
      UserId.from(params.authorId),
      params.content,
      params.createdAt,
      params.updatedAt,
      params.author,
    );
  }

  update(params: UpdatePostProps) {
    this.content = params.content;
    this.updatedAt = new Date();
  }
}
