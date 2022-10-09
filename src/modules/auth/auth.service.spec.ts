import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { RoleRepository } from '../role/role.repository';
import { RoleService } from '../role/role.service';
import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';
import { AuthConfig } from './auth-config';
import { AuthService } from './auth.service';
import { Authorization } from './authorization';
describe('Auth Service', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      providers: [
        AuthService,
        UserService,
        AuthConfig,
        UserRepository,
        RoleService,
        Authorization,
        ConfigService,
        RoleRepository,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
