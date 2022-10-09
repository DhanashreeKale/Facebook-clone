import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Authorization } from '../../auth/authorization';
import { CommentsRepository } from '../comment/comment.repository';
import { CommentService } from '../comment/comment.service';
import { FriendRepository } from '../friendship/friendship.repository';
import { FriendshipService } from '../friendship/friendship.service';
import { UserRepository } from '../user.repository';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostService } from './posts.service';

describe('Posts Controller', () => {
  let controller: PostsController;

  const mockPostService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        PostService,
        ConfigService,
        CommentService,
        Authorization,
        FriendshipService,
        PostsRepository,
        FriendRepository,
        UserRepository,
        CommentsRepository,
      ],
    })
      .overrideProvider(PostService)
      .useValue(mockPostService)
      .compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
