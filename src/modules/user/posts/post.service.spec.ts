import { Test, TestingModule } from '@nestjs/testing';
import { Authorization } from '../../auth/authorization';
import { FriendRepository } from '../friendship/friendship.repository';
import { FriendshipService } from '../friendship/friendship.service';
import { UserRepository } from '../user.repository';
import { PostsRepository } from './posts.repository';
import { PostService } from './posts.service';

describe('Friendship Service', () => {
  let service: PostService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        PostsRepository,
        Authorization,
        FriendshipService,
        FriendRepository,
        UserRepository,
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
