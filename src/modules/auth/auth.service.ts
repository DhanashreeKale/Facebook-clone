import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CredentialsDTO } from '../user/credentials.dto';
import { CreateUserDTO, UserDTO } from '../user/user.dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthConfig } from './auth-config';
import { AccessTokenDTO, TokenDetailsDTO, TokenDTO } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private authConfig: AuthConfig,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user: User = await this.userService.findByUserEmail(email); //findByUserEmail is a method of userService which returns a user(with password) on the basis of email

    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async generateAccessToken(userFromDb: User): Promise<TokenDetailsDTO> {
    const accessGrant = this.authConfig.Options.grantTypes.accessGrant;
    const accessTokenExpiresIn =
      this.authConfig.Options.accessTokenOptions.expiresIn;

    const accessPayload = {
      email: userFromDb.email,
      sub: userFromDb.id,
      roles: userFromDb.roles,
      grantType: accessGrant,
    };

    const tokenDetailsDto: TokenDetailsDTO = new TokenDetailsDTO();

    tokenDetailsDto.token = this.jwtService.sign(accessPayload);
    tokenDetailsDto.grantType = accessGrant;
    tokenDetailsDto.expiresIn = accessTokenExpiresIn;
    return tokenDetailsDto;
  }

  async generateRefreshToken(userFromDb: User): Promise<TokenDetailsDTO> {
    const refreshGrant: string =
      this.authConfig.Options.grantTypes.refreshGrant;
    const refreshTokenExpiresIn: string =
      this.authConfig.Options.refreshTokenOptions.expiresIn;

    const refreshPayload = {
      email: userFromDb.email,
      sub: userFromDb.id,
      grantType: refreshGrant,
    };

    const tokenDetailsDto: TokenDetailsDTO = new TokenDetailsDTO();

    tokenDetailsDto.token = this.jwtService.sign(refreshPayload);
    tokenDetailsDto.grantType = refreshGrant;
    tokenDetailsDto.expiresIn = refreshTokenExpiresIn;
    return tokenDetailsDto;
  }

  async login(user: CredentialsDTO): Promise<TokenDTO> {
    const userFromDb: User = await this.validateUser(user.email, user.password);
    if (!userFromDb) {
      throw new UnauthorizedException();
    }

    const tokenDto: TokenDTO = new TokenDTO();

    tokenDto.accessToken = await this.generateAccessToken(userFromDb);
    tokenDto.refreshToken = await this.generateRefreshToken(userFromDb);

    return tokenDto;
  }

  signUp(user: CreateUserDTO): Promise<UserDTO> {
    return this.userService.createUser(user);
  }

  async refreshToken(token: string): Promise<AccessTokenDTO> {
    const refreshTokenPayload = this.jwtService.verify(token);
    const userFromDb: User = await this.userService.findByUserEmail(
      refreshTokenPayload.email,
    );

    if (refreshTokenPayload.grantType !== 'refresh' || !userFromDb) {
      throw new UnauthorizedException();
    }

    const accessTokenDto: AccessTokenDTO = new AccessTokenDTO();
    accessTokenDto.accessToken = (
      await this.generateAccessToken(userFromDb)
    ).token;
    return accessTokenDto;
  }
}
