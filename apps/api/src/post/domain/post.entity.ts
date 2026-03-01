import { UserId } from '@/user/domain/value-object/user-id.vo';
import { PostId } from './post-id.vo';

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
  ) {}

  static create(params: { authorId: UserId; content: string }) {
    return new PostEntity(
      PostId.create(),
      params.authorId,
      params.content,
      new Date(),
      new Date(),
    );
  }

  static rehydrate(params: {
    id: string;
    authorId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new PostEntity(
      PostId.from(params.id),
      UserId.from(params.authorId),
      params.content,
      params.createdAt,
      params.updatedAt,
    );
  }

  update(params: UpdatePostProps) {
    this.content = params.content;
    this.updatedAt = new Date();
  }
}
