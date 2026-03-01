import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/_shared/interface/guards/jwt-auth.guard';
import { UserId } from '@/user/domain/value-object/user-id.vo';
import type {
  CancelFollowBodyDTO,
  FollowTargetBodyDTO,
  UnFollowTargetBodyDTO,
} from './dto/follow-target.body.dto';
import type {
  AcceptFollowBodyDTO,
  RejectFollowBodyDTO,
} from './dto/accept-follow.body.dto';
import { FollowUserUseCase } from '../application/usecase/follow-user.usecase';
import { UnfollowUserUseCase } from '../application/usecase/unfollow-user.usecase';
import { CancelFollowUseCase } from '../application/usecase/cancel-follow.usecase';
import { AcceptFollowUseCase } from '../application/usecase/accept-follow.usecase';
import { RejectFollowUseCase } from '../application/usecase/reject-follow.usecase';
import { GetRelationUseCase } from '../application/usecase/get-relation.usecase';

@Controller('follow')
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(
    private readonly followUser: FollowUserUseCase,
    private readonly unfollowUser: UnfollowUserUseCase,
    private readonly cancelReq: CancelFollowUseCase,
    private readonly acceptReq: AcceptFollowUseCase,
    private readonly rejectReq: RejectFollowUseCase,
    private readonly getRelation: GetRelationUseCase,
  ) {}

  @Get(':targetUserId/status')
  status(@Req() req: any, @Param('targetUserId') targetUserId: string) {
    return this.getRelation.execute(
      req.user.userId,
      UserId.from(targetUserId),
    );
  }

  @Post()
  follow(@Req() req: any, @Body() dto: FollowTargetBodyDTO) {
    return this.followUser.execute(req.user.userId, dto);
  }

  @Delete()
  unfollow(@Req() req: any, @Body() dto: UnFollowTargetBodyDTO) {
    return this.unfollowUser.execute(req.user.userId, dto);
  }

  @Post('requests/cancel')
  cancel(@Req() req: any, @Body() dto: CancelFollowBodyDTO) {
    return this.cancelReq.execute(req.user.userId, dto);
  }

  @Post('requests/accept')
  accept(@Req() req: any, @Body() dto: AcceptFollowBodyDTO) {
    return this.acceptReq.execute(req.user.userId, dto);
  }

  @Post('requests/reject')
  reject(@Req() req: any, @Body() dto: RejectFollowBodyDTO) {
    return this.rejectReq.execute(req.user.userId, dto);
  }
}
