import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserId } from '@/user/domain/value-object/user-id.vo';
import { Username } from '@/user/domain/value-object/username.vo';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET!,
    });
  }

  async validate(payload: { sub: string; username: string }) {
    return {
      userId: UserId.from(payload.sub),
      username: Username.create(payload.username),
    };
  }
}
