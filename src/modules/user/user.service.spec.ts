import { Test, TestingModule } from '@nestjs/testing';
import { Authorization } from '../auth/authorization';
import { RoleRepository } from '../role/role.repository';
import { RoleService } from '../role/role.service';
import { FriendRepository } from './friendship/friendship.repository';
import { FriendshipService } from './friendship/friendship.service';
import { PostsRepository } from './posts/posts.repository';
import { PostService } from './posts/posts.service';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

describe('User Service', () => {
  let service: UserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        PostService,
        PostsRepository,
        Authorization,
        FriendshipService,
        FriendRepository,
        UserRepository,
        RoleService,
        RoleRepository,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
