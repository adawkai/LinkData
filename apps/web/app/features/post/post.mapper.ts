import type { PostResponseDTO } from "@social/shared";
import type { Post } from "./post.types";
import { UserMapper } from "../user/user.mapper";

export class PostMapper {
  static toPost(post: PostResponseDTO): Post {
    return {
      id: post.id,
      authorId: post.authorId,
      content: post.content,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
      author: UserMapper.toUser(post.author),
    };
  }
}
