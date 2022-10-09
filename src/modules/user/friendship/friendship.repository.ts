import { HttpException, HttpStatus } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { FriendDto } from './friendship.dto';
import { Friendship, status } from './friendship.entity';

@EntityRepository(Friendship)
export class FriendRepository extends Repository<Friendship> {
  async acceptRequestStatus(requestObject: FriendDto) {
    const friendshipStatus = await this.checkStatus(
      requestObject.request_sender_id,
      requestObject.request_receiver_id,
    );
    if (friendshipStatus.status == status.ACCEPTED) {
      throw new HttpException(
        'Request is already accepted',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (friendshipStatus.status == status.DELETED) {
      throw new HttpException(
        'Request has been declined, cant be accepted',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.createQueryBuilder()
      .update(Friendship)
      .set({ status: status.ACCEPTED })
      .where('senderId = :senderId', {
        senderId: requestObject.request_sender_id,
      })
      .andWhere('receiverId = :receiverId', {
        receiverId: requestObject.request_receiver_id,
      })
      .execute();
  }
  async declineRequestStatus(requestObject: FriendDto) {
    const friendshipStatus = await this.checkStatus(
      requestObject.request_sender_id,
      requestObject.request_receiver_id,
    );
    if (friendshipStatus.status == status.ACCEPTED) {
      throw new HttpException(
        'Accepted request, cant be deleted',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (friendshipStatus.status == status.DELETED) {
      throw new HttpException(
        'Request is already deleted',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.createQueryBuilder()
      .update(Friendship)
      .set({ status: status.DELETED })
      .where('senderId = :senderId', {
        senderId: requestObject.request_sender_id,
      })
      .andWhere('receiverId = :receiverId', {
        receiverId: requestObject.request_receiver_id,
      })
      .execute();
  }

  async listOfFriendRequestSent(requestObject: number) {
    const user = await this.createQueryBuilder('friendship')
      .select('user.id', "user's id")
      .addSelect('user.firstName', "User's first name")
      .addSelect('user.lastName', "User's last name")
      .addSelect('friendship.status', 'status')
      .leftJoin('friendship.receiverId', 'user')
      .where('friendship.request_sender_id = :request_sender_id', {
        request_sender_id: requestObject,
      })
      .getRawMany();
    return user;
  }

  async listOfFriendRequestReceived(requestObject: number) {
    const user = await this.createQueryBuilder('friendship')
      .select('user.id', "user's id")
      .addSelect('user.firstName', "User's first name")
      .addSelect('user.lastName', "User's last name")
      .addSelect('friendship.status', 'status')
      .leftJoin('friendship.senderId', 'user')
      .where('friendship.request_receiver_id = :request_receiver_id', {
        request_receiver_id: requestObject,
      })
      .getRawMany();
    return user;
  }

  async checkStatus(senderId: number, receiverId: number) {
    const friendshipStatus = await this.createQueryBuilder('friendship')
      .select('friendship.status', 'status')
      .where('friendship.request_sender_id=:senderId', { senderId: senderId })
      .andWhere('friendship.request_receiver_id=:receiverId', {
        receiverId: receiverId,
      })
      .getRawOne();
    return friendshipStatus;
  }

  async checkIfFriendReqIsSent(senderId: number, receiverId: number) {
    const reqSent = await this.createQueryBuilder('friendship')
      .where('friendship.request_sender_id=:senderId', { senderId: senderId })
      .andWhere('friendship.request_receiver_id=:receiverId', {
        receiverId: receiverId,
      })
      .getOne();
    if (reqSent instanceof Friendship) return true;
    else return false;
  }

  async getFriendsIdOfCurrentlyLoggedInUser(userId: number) {
    const user = await this.createQueryBuilder('friendship')
      .select('user.id', 'userId')
      .leftJoin('friendship.senderId', 'user')
      .where('friendship.request_receiver_id = :request_receiver_id', {
        request_receiver_id: userId,
      })
      .andWhere('friendship.status= :friendStatus', {
        friendStatus: status.ACCEPTED,
      })
      .getRawMany();
    return user;
  }

  async getFriends(userId: number) {
    const user = await this.createQueryBuilder('friendship')
      .select('user_receiver.id', 'Receiver id')
      .addSelect('user_sender.id', 'Sender id')
      .addSelect('user_receiver.firstName', 'Receiver first name')
      .addSelect('user_receiver.lastName', 'Receiver last name')
      .addSelect('user_sender.firstName', 'Sender first name')
      .addSelect('user_sender.lastName', 'Sender last name')
      .addSelect('friendship.status', 'Friendship status')
      .leftJoin('friendship.senderId', 'user_sender')
      .leftJoin('friendship.receiverId', 'user_receiver')
      .where(
        '(friendship.request_receiver_id = :userId OR friendship.request_sender_id=:userId)',
        {
          userId,
        },
      )
      .andWhere('friendship.status= :friendStatus', {
        friendStatus: status.ACCEPTED,
      })
      .getRawMany();
    return user;
  }
}

/*
SELECT "id","firstName","lastName","email","status" FROM public."user", friendship
WHERE public."user".id=friendship.request_receiver_id AND friendship.request_sender_id=7;
*/

/*
If the sender→receiver request is already there in the friendship table throw an exception “request already sent”

SELECT id, status,request_sender_id, request_receiver_id
	FROM public.friendship 
	WHERE request_sender_id=23 AND request_receiver_id=26;
*/
