import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtOptionsFactory, JwtModuleOptions } from '@nestjs/jwt';

@Injectable()
export class AuthConfig implements JwtOptionsFactory {
  Options: {
    jwtOptions: any;
    accessTokenOptions: any;
    refreshTokenOptions: any;
    grantTypes: any;
  };
  constructor(private configService: ConfigService) {
    this.Options = {
      jwtOptions: {
        secret: this.configService.get('jwt.secret'),
        signOptions: {
          expiresIn: this.configService.get('jwt.accessTokenOptions.expiresIn'),
        },
      },
      accessTokenOptions: this.configService.get('jwt.accessTokenOptions'),
      refreshTokenOptions: this.configService.get('jwt.refreshTokenOptions'),
      grantTypes: this.configService.get('jwt.grantTypes'),
    };
  }

  createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
    return {
      secret: this.configService.get('jwt.secret'),
      signOptions: {
        expiresIn: this.configService.get('jwt.accessTokenOptions.expiresIn'),
      },
    };
  }
}
