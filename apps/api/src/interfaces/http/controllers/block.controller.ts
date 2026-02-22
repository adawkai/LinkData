import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { BlockUserUseCase } from 'src/application/block/use-cases/block-user.usecase';
import { UnblockUserUseCase } from 'src/application/block/use-cases/unblock-user.usecase';

@Controller('blocks')
@UseGuards(JwtAuthGuard)
export class BlockController {
  constructor(
    private readonly blockUser: BlockUserUseCase,
    private readonly unBlockUser: UnblockUserUseCase,
  ) {}

  @Post()
  block(@Req() req: any, @Body() body: { targetUserId: string }) {
    return this.blockUser.execute(req.user.userId, {
      targetUserId: body.targetUserId,
    });
  }

  @Delete()
  unblock(@Req() req: any, @Body() body: { targetUserId: string }) {
    return this.unBlockUser.execute(req.user.userId, {
      targetUserId: body.targetUserId,
    });
  }
}
