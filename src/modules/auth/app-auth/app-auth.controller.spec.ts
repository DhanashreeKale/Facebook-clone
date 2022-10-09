import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { RoleRepository } from '../../role/role.repository';
import { RoleService } from '../../role/role.service';
import { UserRepository } from '../../user/user.repository';
import { UserService } from '../../user/user.service';
import { AuthConfig } from '../auth-config';
import { AuthService } from '../auth.service';
import { Authorization } from '../authorization';
import { AppAuthController } from './app-auth.controller';

describe('AppAuth Controller', () => {
  let controller: AppAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      controllers: [AppAuthController],
      providers: [
        AuthService,
        AuthConfig,
        ConfigService,
        UserService,
        UserRepository,
        RoleService,
        Authorization,
        RoleRepository,
      ],
    }).compile();

    controller = module.get<AppAuthController>(AppAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
