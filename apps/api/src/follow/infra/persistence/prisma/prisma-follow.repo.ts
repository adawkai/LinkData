import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/_shared/infra/prisma/prisma.service';
import { FollowRepo } from '@/follow/application/ports/follow-repo.port';
import { FollowEntity } from '@/follow/domain/follow.entity';
import { FollowDatabaseError } from '@/follow/domain/errors';
import { UserId } from '@/user/domain/value-object/user-id.vo';

@Injectable()
export class PrismaFollowRepo implements FollowRepo {
  constructor(private readonly prisma: PrismaService) {}

  async findFollowByFollowerIdAndFollowingId(
    followerId: UserId,
    followingId: UserId,
  ): Promise<FollowEntity | null> {
    try {
      const follow = await this.prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: followerId.toString(),
            followingId: followingId.toString(),
          },
        },
      });
      if (!follow) return null;
      return FollowEntity.create({
        followerId,
        followingId,
      });
    } catch (e) {
      throw new FollowDatabaseError();
    }
  }

  async create(follow: FollowEntity) {
    try {
      const { followerId, followingId } = follow;
      await this.prisma.$transaction(async (tx) => {
        await tx.follow.create({
          data: {
            followerId: followerId.toString(),
            followingId: followingId.toString(),
          },
        });

        await tx.user.update({
          where: { id: followerId.toString() },
          data: { followingCount: { increment: 1 } },
        });
        await tx.user.update({
          where: { id: followingId.toString() },
          data: { followersCount: { increment: 1 } },
        });
      });
    } catch (e) {
      throw new FollowDatabaseError();
    }
  }

  async delete(follow: FollowEntity) {
    try {
      const { followerId, followingId } = follow;
      await this.prisma.$transaction(async (tx) => {
        await tx.follow.delete({
          where: {
            followerId_followingId: {
              followerId: followerId.toString(),
              followingId: followingId.toString(),
            },
          },
        });

        await tx.user.update({
          where: { id: followerId.toString() },
          data: { followingCount: { decrement: 1 } },
        });
        await tx.user.update({
          where: { id: followingId.toString() },
          data: { followersCount: { decrement: 1 } },
        });
      });
    } catch (e) {
      throw new FollowDatabaseError();
    }
  }
}
