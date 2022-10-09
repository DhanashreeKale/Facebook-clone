import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CredentialsDTO } from '../../user/credentials.dto';
import { CreateUserDTO, UserDTO } from '../../user/user.dto';
import { AuthConfig } from '../auth-config';
import { AccessTokenDTO, TokenDetailsDTO, TokenDTO } from '../auth.dto';
import { AuthService } from '../auth.service';

@Controller('auth')
@ApiTags('auth')
export class AppAuthController {
  constructor(
    private authService: AuthService,
    private readonly authConfig: AuthConfig,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: TokenDetailsDTO,
    description: 'TokenDetailsDTO with token details',
  })
  async login(
    @Body() req: CredentialsDTO,
    @Res() res: Response,
  ): Promise<void> {
    const tokens: TokenDTO = await this.authService.login(req);
    const refreshTokenExpiryTime =
      this.authConfig.Options.refreshTokenOptions.expiresIn;
    const refreshTokenPath = this.authConfig.Options.refreshTokenOptions.path;

    res.set(
      'Set-Cookie',
      `refreshToken=${JSON.stringify(
        tokens.refreshToken,
      )}; Path=${refreshTokenPath}; Max-Age=${refreshTokenExpiryTime}; HttpOnly`,
    );
    res.setHeader('Authorization', tokens.accessToken.token);

    res.send(tokens.accessToken);
  }

  @Post('register')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UserDTO,
    description: 'UserDTO with user details',
  })
  signUp(@Body() req: CreateUserDTO): Promise<UserDTO> {
    return this.authService.signUp(req);
  }

  //This path needs to be updated if changed, in config.js -> jwt section
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: AccessTokenDTO,
    description: 'AccessTokenDTO with token details',
  })
  async refreshToken(@Req() req: Request): Promise<AccessTokenDTO> {
    //Client can send refresh token in following ways :body, queryParam, header and cookie
    //Current implementation is "HttpOnly Cookie" but we can change same in /login method
    const refreshToken =
      req.body.refreshToken ||
      req.query.refreshToken ||
      req.headers['x-access-token'] ||
      req.cookies.refreshToken;

    return this.authService.refreshToken(JSON.parse(refreshToken).token);
  }
}
