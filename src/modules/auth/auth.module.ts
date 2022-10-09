import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RequestMetaService } from '../../interceptors/request-meta.service';
import { UserModule } from '../user/user.module';
import { AppAuthController } from './app-auth/app-auth.controller';
import { AuthConfig } from './auth-config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt-strategy';

@Global()
@Module({
  providers: [AuthService, JwtStrategy, AuthConfig, RequestMetaService],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: AuthConfig,
    }),
  ],
  exports: [AuthService, AuthConfig],
  controllers: [AppAuthController],
})
export class AuthModule {}
