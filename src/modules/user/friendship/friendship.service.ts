import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Authorization } from '../../auth/authorization';
import { User } from '../user.entity';
import { UserRepository } from '../user.repository';
import { FriendDto, FriendsDTO, FriendshipDTO } from './friendship.dto';
import { Friendship } from './friendship.entity';
import { FriendRepository } from './friendship.repository';

@Injectable()
export class FriendshipService {
  constructor(
    private readonly frienshipRepository: FriendRepository,
    private readonly userRepository: UserRepository,
    private readonly auth: Authorization,
  ) {}

  async sendRequest(
    requestObject: FriendDto,
    headers: string,
  ): Promise<FriendshipDTO> {
    let friendship: Friendship = new Friendship();
    const userId = parseInt(await this.auth.getPayloadIdFromToken(headers));
    friendship.senderId = new User();
    friendship.senderId.id = userId;
    friendship.receiverId = await this.userRepository.findOne(
      requestObject.request_receiver_id,
    );

    if (!friendship.receiverId)
      throw new HttpException(
        `Receiver with ${requestObject.request_receiver_id} not found`,
        HttpStatus.NOT_FOUND,
      );

    if (friendship.receiverId.id == userId) {
      throw new HttpException(
        `Not valid input. Cannot send friendship to yourself`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const reqStatus1 = await this.frienshipRepository.checkIfFriendReqIsSent(
      friendship.senderId.id,
      requestObject.request_receiver_id,
    );
    const reqStatus2 = await this.frienshipRepository.checkIfFriendReqIsSent(
      requestObject.request_receiver_id,
      friendship.senderId.id,
    );
    if (reqStatus1 == true || reqStatus2 == true)
      throw new HttpException(
        `Request had already been sent`,
        HttpStatus.BAD_REQUEST,
      );

    friendship = await this.frienshipRepository.save(friendship);

    const friendDto: FriendshipDTO = new FriendshipDTO();
    friendDto.request_sender_id = friendship.senderId.id;
    friendDto.request_receiver_id = friendship.receiverId.id;
    friendDto.status = friendship.status;

    return friendDto;
  }

  async acceptRequestStatus(requestObject: FriendsDTO, authorization: string) {
    const receiverOrLoggedInUser = parseInt(
      await this.auth.getPayloadIdFromToken(authorization),
    );
    const sender = await this.userRepository.findOne(
      requestObject.request_sender_id,
    );

    if (!sender)
      throw new HttpException(
        `Sender with ${requestObject.request_sender_id} not found`,
        HttpStatus.NOT_FOUND,
      );

    if (sender.id == receiverOrLoggedInUser) {
      throw new HttpException(`Not valid input. `, HttpStatus.FORBIDDEN);
    }

    requestObject.request_receiver_id = receiverOrLoggedInUser;
    return this.frienshipRepository.acceptRequestStatus(requestObject);
  }
  
  async declineRequestStatus(requestObject: FriendsDTO, authorization: string) {
    const receiverOrLoggedInUser = parseInt(
      await this.auth.getPayloadIdFromToken(authorization),
    );
    const sender = await this.userRepository.findOne(
      requestObject.request_sender_id,
    );

    if (!sender)
      throw new HttpException(
        `Sender with ${requestObject.request_sender_id} not found`,
        HttpStatus.NOT_FOUND,
      );

    if (sender.id == receiverOrLoggedInUser) {
      throw new HttpException(`Not valid input. `, HttpStatus.FORBIDDEN);
    }

    requestObject.request_receiver_id = receiverOrLoggedInUser;
    return this.frienshipRepository.declineRequestStatus(requestObject);
  }

  async listOfFriendRequestSent(authorization: string) {
    const userId = parseInt(
      await this.auth.getPayloadIdFromToken(authorization),
    );
    return this.frienshipRepository.listOfFriendRequestSent(userId);
  }

 
  async listOfFriendRequestReceived(userId: number) {
    return this.frienshipRepository.listOfFriendRequestReceived(userId);
  }

  async getFriendsIdOfCurrentlyLoggedInUser(authorization: string) {
    const Ids = [];
    const userId = parseInt(
      await this.auth.getPayloadIdFromToken(authorization),
    );
    const user =
      await this.frienshipRepository.getFriendsIdOfCurrentlyLoggedInUser(
        userId,
      );
    for (const value of user) Ids.push(value.userId);
    return Ids;
  }

  async getFriends(authorization: string) {
    const userId = parseInt(
      await this.auth.getPayloadIdFromToken(authorization),
    );
    const user = await this.frienshipRepository.getFriends(userId);
    return user;
  }
}
