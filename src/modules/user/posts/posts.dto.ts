import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { AccessModifiers } from './posts.entity';

export class PostDto {
  uploaderId: number;
  @ApiProperty()
  @IsNotEmpty()
  post_content: string;
  @ApiProperty()
  @IsNotEmpty()
  visibility: AccessModifiers;
}

export class PostsDto {
  @ApiResponseProperty()
  uploaderId: number;
  @ApiResponseProperty()
  post_content: string;
  @ApiResponseProperty()
  number_of_likes: number;
  @ApiResponseProperty()
  number_of_dislikes: number;
  @ApiResponseProperty()
  user_who_liked: number[];
  @ApiResponseProperty()
  user_who_disliked: number[];
  @ApiResponseProperty()
  created_at: Date;
  @ApiResponseProperty()
  updated_at: Date;
  @ApiResponseProperty()
  visibility: AccessModifiers;
}

export class PostResponseDto {
  @ApiResponseProperty()
  posts: PostDto[];
}

export class LikeDto {
  @ApiProperty()
  userId: number;
}
