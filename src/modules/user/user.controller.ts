import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { join } from 'path';
import { logger } from '../../config/app-logger.config';
import { PaginationDto } from '../../dto/pager';
import { RequestMeta } from '../../dto/request-meta';
import { RequestMetaService } from '../../interceptors/request-meta.service';
import { TransformHeadersInterceptor } from '../../interceptors/transform.interceptor';
import { Authorization } from '../auth/authorization';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/security.decorators';
import { FriendshipService } from './friendship/friendship.service';
import { PostDto, PostsDto } from './posts/posts.dto';
import { ActivityType } from './posts/posts.entity';
import { PostService } from './posts/posts.service';
import { storage } from './profile/picture-storage';
import { UserDTO, UserResponseDTO } from './user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
@Controller('users')
@ApiSecurity('BearerAuthorization')
@ApiTags('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformHeadersInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly requestMetaService: RequestMetaService,
    private readonly friendshipService: FriendshipService,
    private readonly userRepository: UserRepository,
    private readonly postService: PostService,
    private readonly auth: Authorization,
  ) {}

 
  @Get('me')
  @Roles('USER')
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDTO,
    description: 'UserDTO with user details',
  })
  getUserById(@Headers() auth: string): Promise<UserDTO> {
    return this.userService.getUserById(auth['authorization']);
  }

  
  @Get()
  @Roles('USER')
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDTO,
    description: 'UserResponseDTO with user & pagination details',
  })
  async geAllUsers(
    @Query() paginationDto: PaginationDto,
    @Req() request: Request,
  ): Promise<UserResponseDTO> {
    if (!paginationDto.limit) {
      paginationDto.limit = 10;
    }
    if (!paginationDto.page) {
      paginationDto.page = 1;
    }
    const requestMeta: RequestMeta =
      await this.requestMetaService.getRequestMeta(request);
    logger.debug('requestMeta object ', requestMeta);
    return this.userService.getAllUsers(paginationDto, requestMeta);
  }

 
  @Get('friendships/sent')
  @Roles('USER')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User has sent friend request to the shown',
  })
  
  listOfFriendRequestSent(@Headers() auth: string) {
    return this.friendshipService.listOfFriendRequestSent(
      auth['authorization'],
    );
  }

 
  @Get('friendships/received')
  @Roles('USER')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User has sent friend request to the shown',
  })

  async listOfFriendRequestReceived(@Headers() auth: string) {
    console.log(auth);
    const userId = parseInt(
      await this.auth.getPayloadIdFromToken(auth['authorization']),
    );
    return this.friendshipService.listOfFriendRequestReceived(userId);
  }

  
  @Put('uploadPic')
  @Roles('USER')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          nullable: false,
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', storage))
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User picture has been sent',
  })
  async uploadProfilePic(
    @UploadedFile() file,
    @Request() req,
    @Res() res,
    @Headers() auth: string,
  ) {
    const id = parseInt(
      await this.auth.getPayloadIdFromToken(auth['authorization']),
    );
    this.userRepository
      .createQueryBuilder('user')
      .update(User)
      .set({ profile_pic: file.filename })
      .where('id=:id', { id: id })
      .execute();
    res.send('Picture is uploaded');
  }

  
  @Get('/profilePic')
  @Roles('USER')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users profile pic',
  })
  async getProfilePic(@Headers() auth: string, @Res() res) {
    const id = parseInt(
      await this.auth.getPayloadIdFromToken(auth['authorization']),
    );
    const image = await (
      await this.userRepository.findProfilePic(id)
    ).profile_pic;
    return res.sendFile(join(process.cwd(), 'profileImages/' + image));
  }

  
  @Post('uploadPost')
  @Roles('USER')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Upload a Post',
  })
  uploadPost(@Body() req: PostDto, @Headers() auth: string): Promise<PostsDto> {
    return this.postService.createPost(req, auth['authorization']);
  }

  @Delete('post/:postId')
  @Roles('USER')
  @ApiResponse({
    status: HttpStatus.OK,

    description: 'Delete a single post',
  })
  deleteAPost(@Param('postId') postId: number, @Headers() auth: string) {
    //res.send('Post Deleted');
    return this.postService.deletePost(postId, auth['authorization']);
  }

 
  @Patch('post/:postId/likeDislike/:activityType')
  @Roles('USER')
  @ApiParam({
    name: 'activityType',
    required: false,
    enum: ActivityType,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'logged userId of who is liking or disliking a post',
  })
  async likeOrDislike(
    @Param('activityType') activityType: string,
    @Param('postId') postId: number,
    @Headers() auth: string,
    @Res() res,
  ) {
    res.send(`POST ${activityType}D`);
    return this.postService.userWhoLikedDisliked(
      auth['authorization'],
      postId,
      activityType,
    );
  }
  
  @Get('posts/view')
  @Roles('USER')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All post content of currently logged in user',
  })
  getAllPostInfoOfCurrentUser(@Headers() auth: string) {
    return this.postService.getPostByUser(auth['authorization']);
  }
}
