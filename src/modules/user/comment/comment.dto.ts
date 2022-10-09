import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CommentDto {
  @ApiProperty()
  @IsNotEmpty()
  postId: number;

  @ApiProperty()
  @IsNotEmpty()
  commentContent: string;
}

export class CommentsDto {
  @ApiResponseProperty()
  content: string;
  @ApiResponseProperty()
  created_at: Date;
  @ApiResponseProperty()
  updated_at: Date;
  @ApiResponseProperty()
  userId: number;
  @ApiResponseProperty()
  postId: number;
}

export class CommentResponseDto {
  @ApiResponseProperty()
  comment: CommentsDto[];
}
