import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestMetaService } from '../../interceptors/request-meta.service';
import { Authorization } from '../auth/authorization';
import { RoleModule } from '../role/role.module';
import { CommentsController } from './comment/comment.controller';
import { CommentsRepository } from './comment/comment.repository';
import { CommentService } from './comment/comment.service';
import { FriendshipController } from './friendship/friendship.controller';
import { FriendRepository } from './friendship/friendship.repository';
import { FriendshipService } from './friendship/friendship.service';
import { PostsController } from './posts/posts.controller';

import { PostsRepository } from './posts/posts.repository';
import { PostService } from './posts/posts.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  providers: [
    UserService,
    RequestMetaService,
    FriendshipService,
    PostService,
    CommentService,
    Authorization,
  ],
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      FriendRepository,
      PostsRepository,
      CommentsRepository,
    ]),
    RoleModule,
  ],
  controllers: [
    UserController,
    FriendshipController,
    PostsController,
    CommentsController,
  ],
  exports: [UserService],
})
export class UserModule {}
