import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { TransformHeadersInterceptor } from '../../../interceptors/transform.interceptor';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/security.decorators';
import { FriendDto, FriendsDTO, FriendshipDTO } from './friendship.dto';
import { FriendshipService } from './friendship.service';
@Controller('friendship')
@ApiSecurity('BearerAuthorization')
@ApiTags('friendRequest')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformHeadersInterceptor)
export class FriendshipController {
  constructor(
    private readonly friendshipService: FriendshipService
  ) {}

 
  @Post('request')
  @Roles('USER')
  @ApiResponse({
    status: HttpStatus.OK,
    type: FriendshipDTO,
    description: 'Friend request sent',
  })
  async sendRequest(
    @Body() user: FriendDto,
    @Headers() auth: string,
  ): Promise<FriendshipDTO> {
    return this.friendshipService.sendRequest(user, auth['authorization']);
  }

  
  @Patch('accept')
  @Roles('USER')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Friend Request Status Updated',
  })
  acceptRequestStatus(@Body() req: FriendsDTO, @Headers() auth: string) {
    return this.friendshipService.acceptRequestStatus(
      req,
      auth['authorization'],
    );
  }


  @Patch('decline')
  @Roles('USER')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Friend Request Status Updated',
  })
  declineRequestStatus(@Body() req: FriendsDTO, @Headers() auth: string) {
    return this.friendshipService.declineRequestStatus(
      req,
      auth['authorization'],
    );
  }

  @Get('user/friends')
  @Roles('USER')
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Id's of friends of currently logged in user",
  })
  getFriends(@Headers() auth: string) {
    return this.friendshipService.getFriends(auth['authorization']);
  }
}
