import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthConfig } from './auth-config';
import { PassportStrategies } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  PassportStrategies.JWT_SECRET_STRATEGY,
) {
  constructor(private readonly authConfig: AuthConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.Options.jwtOptions.secret,
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async validate(payload: any): Promise<any> {
    if (payload.grantType !== this.authConfig.Options.grantTypes.accessGrant) {
      throw new UnauthorizedException(
        `No "access" grant found for user ${payload.email}`,
      );
    }
    return { userId: payload.sub, email: payload.email, roles: payload.roles };
  }
}
