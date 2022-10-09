import { Test, TestingModule } from '@nestjs/testing';
import { Authorization } from '../../auth/authorization';
import { UserRepository } from '../user.repository';
import { FriendRepository } from './friendship.repository';
import { FriendshipService } from './friendship.service';

describe('Friendship Service', () => {
  let service: FriendshipService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendshipService,
        FriendRepository,
        Authorization,
        UserRepository,
      ],
    }).compile();

    service = module.get<FriendshipService>(FriendshipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
