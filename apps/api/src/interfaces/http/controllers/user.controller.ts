import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

import { UpdatePrivacyDtoClass } from '../../../application/user/dto/update-privacy.dto';
import { GetMeUseCase } from 'src/application/user/use-cases/get-me.usecase';
import { UpdatePrivacyUseCase } from 'src/application/user/use-cases/update-privacy.usecase';
import { GetUserByUsernameUseCase } from 'src/application/user/use-cases/get-user-by-username.usecase';

@Controller('users')
export class UserController {
  constructor(
    private readonly getMe: GetMeUseCase,
    private readonly updatePrivacy: UpdatePrivacyUseCase,
    private readonly getByUsername: GetUserByUsernameUseCase,
  ) {}

  @Get('by-username/:username')
  byUsername(@Param('username') username: string) {
    return this.getByUsername.execute(username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return this.getMe.execute(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/privacy')
  privacy(@Req() req: any, @Body() dto: UpdatePrivacyDtoClass) {
    const input = { isPrivate: dto.isPrivate };
    return this.updatePrivacy.execute(req.user.userId, input);
  }
}
