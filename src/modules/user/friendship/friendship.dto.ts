import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FriendDto {
  request_sender_id: number;
  @ApiProperty()
  @IsNotEmpty()
  request_receiver_id: number;
}

export class FriendsDTO {
  @ApiProperty()
  @IsNotEmpty()
  request_sender_id: number;
  request_receiver_id: number;
}

export class FriendshipDTO {
  @ApiResponseProperty()
  request_sender_id: number;

  @ApiResponseProperty()
  request_receiver_id: number;

  @ApiResponseProperty()
  status: string;
}

export class FriendshipResponseDto {
  @ApiResponseProperty()
  friends: FriendDto[];
}
