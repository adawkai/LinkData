import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

import { UpdatePrivacyDto } from '../../../application/user/dto/update-privacy.dto';
import { GetMeUseCase } from 'src/application/user/use-cases/get-me.usecase';
import { UpdatePrivacyUseCase } from 'src/application/user/use-cases/update-privacy.usecase';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly getMe: GetMeUseCase,
    private readonly updatePrivacy: UpdatePrivacyUseCase,
  ) {}

  @Get('me')
  me(@Req() req: any) {
    return this.getMe.execute(req.user.userId);
  }

  @Patch('me/privacy')
  privacy(@Req() req: any, @Body() dto: UpdatePrivacyDto) {
    return this.updatePrivacy.execute(req.user.userId, {
      isPrivate: dto.isPrivate,
    });
  }
}
