import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Authorization } from '../../auth/authorization';
import { FriendshipService } from '../friendship/friendship.service';
import { AccessModifiers } from '../posts/posts.entity';
import { PostsRepository } from '../posts/posts.repository';
import { User } from '../user.entity';
import { CommentDto, CommentsDto } from './comment.dto';
import { Comments } from './comment.entity';
import { CommentsRepository } from './comment.repository';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly auth: Authorization,
    private readonly friendshipService: FriendshipService,
  ) {}

  async uploadComment(
    requestObject: CommentDto,
    authorization: string,
  ): Promise<CommentsDto> {
    const post = await this.postsRepository.findOne(requestObject.postId, {
      relations: ['uploaderId'],
    });
    if (!post)
      throw new HttpException(
        'such a post does not exists',
        HttpStatus.NOT_FOUND,
      );
    const userId = parseInt(
      await this.auth.getPayloadIdFromToken(authorization),
    ); 

    if (post.visibility == AccessModifiers.PUBLIC) {
      let comment: Comments = new Comments();
      comment.commenter = new User();
      comment.commenter.id = userId;
      comment.post = post;
      comment.content = requestObject.commentContent;

      comment = await this.commentRepository.save(comment);

      const commentDto: CommentsDto = new CommentsDto();
      commentDto.userId = comment.commenter.id;
      commentDto.postId = comment.post.post_id;
      commentDto.content = comment.content;
      commentDto.created_at = comment.created_at;
      commentDto.updated_at = comment.updated_at;
      return commentDto;
    } else if (post.visibility == AccessModifiers.PRIVATE) {
      const Ids =
        await this.friendshipService.getFriendsIdOfCurrentlyLoggedInUser(
          authorization,
        );
      if (!Ids.length)
        throw new UnauthorizedException(
          'You are not authorized to comment on this post',
        );
      if (Ids.includes(post.uploaderId.id)) {
        let comment: Comments = new Comments();
        comment.commenter = new User();
        comment.commenter.id = userId;
        comment.post = post;
        comment.content = requestObject.commentContent;

        comment = await this.commentRepository.save(comment);

        const commentDto: CommentsDto = new CommentsDto();
        commentDto.userId = comment.commenter.id;
        commentDto.postId = comment.post.post_id;
        commentDto.content = comment.content;
        commentDto.created_at = comment.created_at;
        commentDto.updated_at = comment.updated_at;
        return commentDto;
      }
    } else
      throw new UnauthorizedException(
        'You are not authorized to comment on this post',
      );
  }


  async deleteAComment(commentId: number, userId: number) {
    try {
      const comment = await this.commentRepository.findOne(commentId, {
        relations: ['commenter'], 
      }); 
      if (!comment)
        throw new HttpException('no such comment found', HttpStatus.NOT_FOUND);

      const whoCommented = comment.commenter.id;
      if (whoCommented != userId) {
        throw new HttpException(
          'You are not authorized to delete the comment!',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return this.commentRepository.deleteComment(commentId);
    } catch (error) {
      return error;
    }
  }
}
