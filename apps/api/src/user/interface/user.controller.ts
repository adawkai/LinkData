import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/_shared/interface/guards/jwt-auth.guard';

import { GetByUserNameUseCase } from '../application/usecase/get-by-username.usecase';
import { GetMeUseCase } from '../application/usecase/get-me.usecase';
import { ListUserUseCase } from '../application/usecase/list-user.usecase';
import { Username } from '@/user/domain/value-object/username.vo';
import { UserId } from '@/user/domain/value-object/user-id.vo';

@Controller('users')
export class UserController {
  constructor(
    private readonly getMe: GetMeUseCase,
    private readonly getUserByUsername: GetByUserNameUseCase,
    private readonly listUsers: ListUserUseCase,
  ) {}

  @Get('search')
  search(
    @Query('query') query: string,
    @Query('cursor') cursor?: string,
    @Query('take') take?: string,
  ) {
    return this.listUsers.execute(query || '', {
      cursor,
      take: take ? parseInt(take, 10) : undefined,
    });
  }

  @Get('by-username/:username')
  byUsername(@Param('username') username: string) {
    const urname = Username.create(username);
    return this.getUserByUsername.execute(urname);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return this.getMe.execute(req.user.userId);
  }
}
