import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './infrastructure/prisma/prisma.module';

import { TOKENS } from './application/tokens';

// use cases
import { RegisterUseCase } from './application/auth/use-cases/register.usecase';
import { LoginUseCase } from './application/auth/use-cases/login.usecase';

import { GetMeUseCase } from './application/user/use-cases/get-me.usecase';
import { UpdatePrivacyUseCase } from './application/user/use-cases/update-privacy.usecase';

import { GetProfileUseCase } from './application/profile/use-cases/get-profile.usecase';
import { UpdateProfileUseCase } from './application/profile/use-cases/update-profile.usecase';

import { FollowUserUseCase } from './application/follow/use-cases/follow-user.usecase';
import { UnfollowUserUseCase } from './application/follow/use-cases/unfollow-user.usecase';
import { CancelFollowRequestUseCase } from './application/follow/use-cases/cancel-follow-request.usecase';
import { AcceptFollowRequestUseCase } from './application/follow/use-cases/accept-follow-request.usecase';
import { RejectFollowRequestUseCase } from './application/follow/use-cases/reject-follow-request.usecase';

import { BlockUserUseCase } from './application/block/use-cases/block-user.usecase';
import { UnblockUserUseCase } from './application/block/use-cases/unblock-user.usecase';

import { CreatePostUseCase } from './application/post/use-cases/create-post.usecase';
import { GetFeedUseCase } from './application/post/use-cases/get-feed.usecase';

// infra
import { PrismaUserRepo } from './infrastructure/repositories/prisma-user.repo';
import { PrismaProfileRepo } from './infrastructure/repositories/prisma-profile.repo';
import { PrismaFollowRepo } from './infrastructure/repositories/prisma-follow.repo';
import { PrismaFollowRequestRepo } from './infrastructure/repositories/prisma-follow-request.repo';
import { PrismaBlockRepo } from './infrastructure/repositories/prisma-block.repo';
import { PrismaPostRepo } from './infrastructure/repositories/prisma-post.repo';
import { BcryptHasher } from './infrastructure/security/bcrypt.hasher';
import { JwtSigner } from './infrastructure/security/jwt.signer';

// http
import { JwtStrategy } from './interfaces/http/strategies/jwt.strategy';
import { AuthController } from './interfaces/http/controllers/auth.controller';
import { UserController } from './interfaces/http/controllers/user.controller';
import { ProfileController } from './interfaces/http/controllers/profile.controller';
import { FollowController } from './interfaces/http/controllers/follow.controller';
import { BlockController } from './interfaces/http/controllers/block.controller';
import { PostController } from './interfaces/http/controllers/post.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [
    AuthController,
    UserController,
    ProfileController,
    FollowController,
    BlockController,
    PostController,
  ],
  providers: [
    JwtStrategy,

    // use cases
    RegisterUseCase,
    LoginUseCase,
    GetMeUseCase,
    UpdatePrivacyUseCase,
    GetProfileUseCase,
    UpdateProfileUseCase,
    FollowUserUseCase,
    UnfollowUserUseCase,
    CancelFollowRequestUseCase,
    AcceptFollowRequestUseCase,
    RejectFollowRequestUseCase,
    BlockUserUseCase,
    UnblockUserUseCase,
    CreatePostUseCase,
    GetFeedUseCase,

    // adapters
    { provide: TOKENS.USER_AUTH_REPO, useClass: PrismaUserRepo },
    { provide: TOKENS.USER_READ_REPO, useClass: PrismaUserRepo },
    { provide: TOKENS.USER_RELATIONS, useClass: PrismaUserRepo },
    { provide: TOKENS.USER_VISIBILITY, useClass: PrismaUserRepo },

    { provide: TOKENS.PROFILE_REPO, useClass: PrismaProfileRepo },

    { provide: TOKENS.FOLLOW_REPO, useClass: PrismaFollowRepo },
    { provide: TOKENS.FOLLOW_REQUEST_REPO, useClass: PrismaFollowRequestRepo },

    { provide: TOKENS.BLOCK_REPO, useClass: PrismaBlockRepo },

    { provide: TOKENS.POST_REPO, useClass: PrismaPostRepo },
    { provide: TOKENS.POST_USER, useClass: PrismaUserRepo },

    { provide: TOKENS.PASSWORD_HASHER, useClass: BcryptHasher },
    { provide: TOKENS.TOKEN_SIGNER, useClass: JwtSigner },
  ],
})
export class AppModule {}
