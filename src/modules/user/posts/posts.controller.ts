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
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { TransformHeadersInterceptor } from '../../../interceptors/transform.interceptor';
import { Authorization } from '../../auth/authorization';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/security.decorators';
import { CommentDto } from '../comment/comment.dto';
import { CommentService } from '../comment/comment.service';
import { AccessModifiers } from './posts.entity';
import { PostService } from './posts.service';

@Controller('posts')
@ApiSecurity('BearerAuthorization')
@ApiTags('Posts')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformHeadersInterceptor)
export class PostsController {
  constructor(
    private readonly commentService: CommentService,
    private readonly postService: PostService,
    private readonly auth: Authorization,
  ) {}
  @Post('comment')
  @Roles('USER')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Comment on a post by of user',
  })
  async uploadComment(
    @Body() requestObject: CommentDto,
    @Headers() auth: string,
  ) {
    return this.commentService.uploadComment(
      requestObject,
      auth['authorization'],
    );
  }

  @Delete('comment/:id')
  @Roles('USER')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Delete a comment on a post',
  })
  async deleteAComment(@Param('id') id: number, @Headers() auth: string) {
    const userId = parseInt(
      await this.auth.getPayloadIdFromToken(auth['authorization']),
    );
    return this.commentService.deleteAComment(id, userId);
  }

  @Get(':postId/info')
  @Roles('USER')
  @ApiOkResponse({
    description: 'All detailes of a particular post',
  })
  async allInfoOfPost(
    @Param('postId') postId: number,
    @Headers() auth: string,
  ) {
    return this.postService.getAllPostInfo(postId, auth['authorization']);
  }

  @Patch('post/:postId/visible/:accessModifiers')
  @Roles('USER')
  @ApiParam({
    name: 'accessModifiers',
    required: false,
    enum: AccessModifiers,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Change the visibility of a post',
  })
  async changeVisibilityOfPost(
    @Param('accessModifiers') accessModifiers: string,
    @Param('postId') postId: number,
    @Headers() auth: string,
    @Res() res,
  ) {
    const userId = parseInt(
      await this.auth.getPayloadIdFromToken(auth['authorization']),
    );
    this.postService.postAccessType(userId, postId, accessModifiers);
    res.send(`Post is now ${accessModifiers}`);
  }
}
