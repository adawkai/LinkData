import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/_shared/infra/prisma/prisma.service';
import type { BlockRepo } from '@/block/application/port/block-repo';
import { BlockEntity } from '@/block/domain/block.entity';
import { BlockDatabaseError } from '@/block/domain/errors';
import { UserId } from '@/user/domain/value-object/user-id.vo';

@Injectable()
export class PrismaBlockRepo implements BlockRepo {
  constructor(private readonly prisma: PrismaService) {}

  async exists(block: BlockEntity) {
    try {
      return !!(await this.prisma.block.findUnique({
        where: {
          blockerId_blockedId: {
            blockerId: block.blockerId.toString(),
            blockedId: block.blockedId.toString(),
          },
        },
        select: { blockerId: true },
      }));
    } catch (e) {
      throw new BlockDatabaseError();
    }
  }

  async create(block: BlockEntity) {
    try {
      const { blockerId, blockedId } = block;
      await this.prisma.$transaction(async (tx) => {
        await tx.block.create({
          data: {
            blockerId: blockerId.toString(),
            blockedId: blockedId.toString(),
          },
        });

        // remove follows both ways and fix counters if existed
        const aFollowsB = await tx.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: blockerId.toString(),
              followingId: blockedId.toString(),
            },
          },
          select: { followerId: true },
        });
        if (aFollowsB) {
          await tx.follow.delete({
            where: {
              followerId_followingId: {
                followerId: blockerId.toString(),
                followingId: blockedId.toString(),
              },
            },
          });
          await tx.user.update({
            where: { id: blockerId.toString() },
            data: { followingCount: { decrement: 1 } },
          });
          await tx.user.update({
            where: { id: blockedId.toString() },
            data: { followersCount: { decrement: 1 } },
          });
        }

        const bFollowsA = await tx.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: blockedId.toString(),
              followingId: blockerId.toString(),
            },
          },
          select: { followerId: true },
        });
        if (bFollowsA) {
          await tx.follow.delete({
            where: {
              followerId_followingId: {
                followerId: blockedId.toString(),
                followingId: blockerId.toString(),
              },
            },
          });
          await tx.user.update({
            where: { id: blockedId.toString() },
            data: { followingCount: { decrement: 1 } },
          });
          await tx.user.update({
            where: { id: blockerId.toString() },
            data: { followersCount: { decrement: 1 } },
          });
        }

        // remove follow requests both ways
        await tx.followRequest.deleteMany({
          where: {
            OR: [
              {
                requesterId: blockerId.toString(),
                requestedId: blockedId.toString(),
              },
              {
                requesterId: blockedId.toString(),
                requestedId: blockerId.toString(),
              },
            ],
          },
        });
      });
    } catch (e) {
      throw new BlockDatabaseError();
    }
  }

  async delete(block: BlockEntity) {
    try {
      await this.prisma.block.delete({
        where: {
          blockerId_blockedId: {
            blockerId: block.blockerId.toString(),
            blockedId: block.blockedId.toString(),
          },
        },
      });
    } catch (e) {
      throw new BlockDatabaseError();
    }
  }

  async findBlockByBlockerIdAndBlockedId(blockerId: UserId, blockedId: UserId) {
    try {
      const block = await this.prisma.block.findUnique({
        where: {
          blockerId_blockedId: {
            blockerId: blockerId.toString(),
            blockedId: blockedId.toString(),
          },
        },
      });

      if (!block) return null;
      return BlockEntity.rehydrate({
        blockerId: block.blockerId,
        blockedId: block.blockedId,
        createdAt: block.createdAt,
      });
    } catch (e) {
      throw new BlockDatabaseError();
    }
  }
}
