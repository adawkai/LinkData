import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserAuthRepoPort } from '../../application/auth/ports/user-auth-repo.port';
import { UserReadRepoPort } from '../../application/user/ports/user-read-repo.port';
import { UserRelationsPort } from '../../application/follow/ports/user-relations.port';
import { UserVisibilityPort } from '../../application/profile/ports/user-visibility.port';
import { PostUserPort } from 'src/application/post/ports/post-user.port';
import { User } from '@prisma/client';
import { UserSummaryRes } from 'src/application/_shared/models/user-summary';

@Injectable()
export class PrismaUserRepo
  implements
    UserAuthRepoPort,
    UserReadRepoPort,
    UserRelationsPort,
    UserVisibilityPort,
    PostUserPort
{
  constructor(private readonly prisma: PrismaService) {}

  // Auth
  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        role: true,
        isActive: true,
      },
    });
  }

  findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        role: true,
        isActive: true,
      },
    });
  }

  createUser(data: { email: string; username: string; password: string }) {
    return this.prisma.user.create({
      data,
      select: { id: true, email: true, username: true, role: true },
    });
  }

  // User
  getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isPrivate: true,
        isActive: true,
        postCount: true,
        followersCount: true,
        followingCount: true,
      },
    });
  }

  async getByUsername(username: string) {
    const u = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        role: true,
        isPrivate: true,
        isActive: true,
        followersCount: true,
        followingCount: true,
        postCount: true,
        profile: { select: { name: true, avatarUrl: true } },
      },
    });
    if (!u) return null;
    return {
      id: u.id,
      username: u.username,
      role: u.role,
      isPrivate: u.isPrivate,
      isActive: u.isActive,
      name: u.profile?.name ?? null,
      avatarUrl: u.profile?.avatarUrl ?? null,
      followersCount: u.followersCount,
      followingCount: u.followingCount,
      postCount: u.postCount,
    };
  }

  async setPrivacy(userId: string, isPrivate: boolean) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isPrivate },
    });
  }

  async listUsers(query: string, cursor?: string, take?: number) {
    const takeWithExtra = take ? take + 1 : 21;
    let users: UserSummaryRes[] = [];
    if (!query) {
      const res = await this.prisma.user.findMany({
        take: takeWithExtra,
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : 0,
        orderBy: { id: 'asc' },
        select: {
          id: true,
          username: true,
          role: true,
          isPrivate: true,
          isActive: true,
          followersCount: true,
          followingCount: true,
          postCount: true,
          profile: { select: { name: true, avatarUrl: true } },
        },
      });
      users = res.map((u) => ({
        id: u.id,
        username: u.username,
        role: u.role,
        isPrivate: u.isPrivate,
        isActive: u.isActive,
        name: u.profile?.name ?? null,
        avatarUrl: u.profile?.avatarUrl ?? null,
        followersCount: u.followersCount,
        followingCount: u.followingCount,
        postCount: u.postCount,
      }));
    } else {
      const profiles = await this.prisma.profile.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
        take: takeWithExtra,
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : 0,
        orderBy: { id: 'asc' },
        select: {
          userId: true,
          name: true,
          avatarUrl: true,
          user: {
            select: {
              id: true,
              username: true,
              role: true,
              isPrivate: true,
              isActive: true,
              followersCount: true,
              followingCount: true,
              postCount: true,
            },
          },
        },
      });
      users = profiles.map((p) => ({
        id: p.userId,
        username: p.user.username,
        role: p.user.role,
        isPrivate: p.user.isPrivate,
        isActive: p.user.isActive,
        name: p.name,
        avatarUrl: p.avatarUrl,
        followersCount: p.user.followersCount,
        followingCount: p.user.followingCount,
        postCount: p.user.postCount,
      }));
    }

    let nextCursor: string | null = null;
    const items = [...users];
    if (take && items.length > take) {
      const lastItem = items.pop();
      nextCursor = lastItem?.id ?? null;
    } else if (!take && items.length > 20) {
      const lastItem = items.pop();
      nextCursor = lastItem?.id ?? null;
    }

    return {
      items,
      nextCursor,
    };
  }

  // Relations/Visibility
  async exists(userId: string) {
    const u = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    return !!u;
  }

  async isPrivate(userId: string) {
    const u = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isPrivate: true },
    });
    return u?.isPrivate ?? false;
  }

  async isBlockedEitherDirection(a: string, b: string) {
    const row = await this.prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: a, blockedId: b },
          { blockerId: b, blockedId: a },
        ],
      },
      select: { blockerId: true },
    });
    return !!row;
  }

  async getPrivacyFacts(viewerId: string | null, targetId: string) {
    const target = await this.prisma.user.findUnique({
      where: { id: targetId },
      select: { isPrivate: true },
    });
    if (!target) return { targetIsPrivate: true, viewerFollowsTarget: false };

    if (!target.isPrivate) {
      return { targetIsPrivate: false, viewerFollowsTarget: true };
    }

    if (!viewerId) {
      return { targetIsPrivate: true, viewerFollowsTarget: false };
    }

    if (viewerId === targetId) {
      return { targetIsPrivate: true, viewerFollowsTarget: true };
    }

    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId: viewerId, followingId: targetId },
      },
      select: { followerId: true },
    });

    return { targetIsPrivate: true, viewerFollowsTarget: !!follow };
  }

  async isActive(userId: string) {
    const u = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isActive: true },
    });
    return u?.isActive ?? false;
  }
}
