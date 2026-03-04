import {
  Body,
  Controller,
  Get,
  Post as HttpPost,
  Logger,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/_shared/interface/guards/jwt-auth.guard';

// Use Cases
import { CreatePostUseCase } from '../application/use-cases/create-post.usecase';
import { GetFeedUseCase } from '../application/use-cases/get-feed.usecase';

// DTOs
import {
  CreatePostBodyDTO,
  CreatePostResponseDTO,
  PostListResponseDTO,
} from '@social/shared';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(
    private readonly createPost: CreatePostUseCase,
    private readonly getFeed: GetFeedUseCase,
  ) {}

  @HttpPost()
  create(
    @Req() req: any,
    @Body() dto: CreatePostBodyDTO,
  ): Promise<CreatePostResponseDTO> {
    return this.createPost.execute(req.user.userId, dto);
  }

  @Get('feed')
  feed(
    @Req() req: any,
    @Query('cursor') cursor?: string,
    @Query('take') take?: string,
  ): Promise<PostListResponseDTO> {
    Logger.log('feed', req.user.userId, cursor, take);
    return this.getFeed.execute(req.user.userId, {
      cursor,
      take: take ? parseInt(take, 10) : 10,
    });
  }
}
