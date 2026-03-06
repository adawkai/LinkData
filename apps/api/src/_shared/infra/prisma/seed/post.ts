import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { UserEntity } from '@/user/domain/entity/user.entity';
import { PostEntity } from '@/post/domain/post.entity';

export const seedPost = async (
  prisma: PrismaClient,
  users: UserEntity[],
  postCount = 4,
) => {
  console.log('Seeding posts...');
  const posts: PostEntity[] = [];
  for (let i = 0; i < postCount; i++) {
    for (const user of users) {
      const content = faker.lorem.sentence();
      const post = PostEntity.create({
        author: user,
        content,
      });
      posts.push(post);

      await prisma.$transaction(async (tx) => {
        await tx.post.create({
          data: {
            id: post.id.toString(),
            authorId: post.authorId.toString(),
            content: post.content,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
          },
        });

        await tx.user.update({
          where: { id: user.id.toString() },
          data: {
            postCount: { increment: 1 },
          },
        });
      });
    }
  }
  return posts;
};
