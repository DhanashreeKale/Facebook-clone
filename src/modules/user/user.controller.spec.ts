import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { RequestMetaService } from '../../interceptors/request-meta.service';
import { Authorization } from '../auth/authorization';
import { RoleRepository } from '../role/role.repository';
import { RoleService } from '../role/role.service';
import { CommentsRepository } from './comment/comment.repository';
import { CommentService } from './comment/comment.service';
import { FriendRepository } from './friendship/friendship.repository';
import { FriendshipService } from './friendship/friendship.service';
import { PostsRepository } from './posts/posts.repository';
import { PostService } from './posts/posts.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

describe('Posts Controller', () => {
  let controller: UserController;

  const mockUserService = {};
  const token = {
    "auth['authorization']":
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbUBnbWFpbC5jb20iLCJzdWIiOjM0LCJyb2xlcyI6W3siaWQiOjEsIm5hbWUiOiJVU0VSIn1dLCJncmFudFR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE2NTgyOTkyNTQsImV4cCI6MTY1ODMwMjg1NH0.CY3nFV5_Fo9c2OfC759n0Wz0MfW7bsBee9CFiGc0Y9g',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        PostService,
        ConfigService,
        CommentService,
        Authorization,
        FriendshipService,
        PostsRepository,
        FriendRepository,
        UserRepository,
        CommentsRepository,
        RoleService,
        RoleRepository,
        RequestMetaService,
      ],
    })
      .overrideProvider(PostService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get currently logged in user', async () => {
    const res = await controller.listOfFriendRequestReceived(
      token["auth['authorization']"],
    );
    expect(res[0].id).toEqual(34);
  });
});
