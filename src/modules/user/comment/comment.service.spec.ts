import { Test, TestingModule } from '@nestjs/testing';
import { Authorization } from '../../auth/authorization';
import { FriendRepository } from '../friendship/friendship.repository';
import { FriendshipService } from '../friendship/friendship.service';
import { PostsRepository } from '../posts/posts.repository';
import { UserRepository } from '../user.repository';
import { CommentsRepository } from './comment.repository';
import { CommentService } from './comment.service';

describe('Comment Service', () => {
  let service: CommentService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        FriendshipService,
        FriendRepository,
        CommentsRepository,
        PostsRepository,
        Authorization,
        UserRepository,
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
