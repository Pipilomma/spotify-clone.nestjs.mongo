import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { jwtSecret } from "../constants/jwt-constant";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

async validate(payload: {id: string; role: string}) {
    const user = await this.userService.getById(payload.id);

    if (!user) {
        throw new UnauthorizedException('User not found');
    }

    return user;
  }
}