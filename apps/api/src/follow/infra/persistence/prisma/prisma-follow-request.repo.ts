import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/_shared/infra/prisma/prisma.service';
import { FollowRequestRepoPort } from '@/follow/application/ports/follow-request.repo.port';
import { FollowRequestEntity } from '@/follow/domain/follow-request.entity';
import { FollowRequestDatabaseError } from '@/follow/domain/errors';
import { UserId } from '@/user/domain/value-object/user-id.vo';

@Injectable()
export class PrismaFollowRequestRepo implements FollowRequestRepoPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(followRequest: FollowRequestEntity) {
    try {
      const { requesterId, requestedId } = followRequest;
      await this.prisma.followRequest.create({
        data: {
          requesterId: requesterId.toString(),
          requestedId: requestedId.toString(),
        },
      });
    } catch (e) {
      throw new FollowRequestDatabaseError();
    }
  }

  async delete(followRequest: FollowRequestEntity) {
    try {
      const { requesterId, requestedId } = followRequest;
      await this.prisma.followRequest.delete({
        where: {
          requesterId_requestedId: {
            requesterId: requesterId.toString(),
            requestedId: requestedId.toString(),
          },
        },
      });
    } catch (e) {
      throw new FollowRequestDatabaseError();
    }
  }

  async findFollowRequestByRequesterIdAndRequestedId(
    requesterId: UserId,
    requestedId: UserId,
  ): Promise<FollowRequestEntity | null> {
    try {
      const followRequest = await this.prisma.followRequest.findUnique({
        where: {
          requesterId_requestedId: {
            requesterId: requesterId.toString(),
            requestedId: requestedId.toString(),
          },
        },
      });
      if (!followRequest) return null;
      return FollowRequestEntity.create({
        requesterId,
        requestedId,
      });
    } catch (e) {
      throw new FollowRequestDatabaseError();
    }
  }
}
