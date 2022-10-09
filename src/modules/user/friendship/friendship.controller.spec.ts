import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { FriendshipController } from './friendship.controller';
import { FriendshipService } from './friendship.service';

describe('Friendship Controller', () => {
  let controller: FriendshipController;

  const mockFriendshipService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendshipController],
      providers: [
        FriendshipService,
        ConfigService,
        { provide: getRepositoryToken(User), useValue: {} },
      ],
    })
      .overrideProvider(FriendshipService)
      .useValue(mockFriendshipService)
      .compile();

    controller = module.get<FriendshipController>(FriendshipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

