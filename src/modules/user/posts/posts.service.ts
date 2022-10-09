import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { logger } from '../../../config/app-logger.config';
import { Authorization } from '../../auth/authorization';
import { FriendshipService } from '../friendship/friendship.service';
import { User } from '../user.entity';
import { PostDto, PostsDto } from './posts.dto';
import { AccessModifiers, Post } from './posts.entity';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly auth: Authorization,
    private readonly friendshipService: FriendshipService,
  ) {}

 
  async createPost(
    requestObject: PostDto,
    authorization: string,
  ): Promise<PostsDto> {
    let post: Post = new Post();
    post.uploaderId = new User();

    const userId = parseInt(
      await this.auth.getPayloadIdFromToken(authorization),
    );
    post.uploaderId.id = userId;
    post.post_content = requestObject.post_content;
    post.visibility = requestObject.visibility;
    if (
      post.visibility == 'public' ||
      post.visibility == 'private' ||
      post.visibility == 'only me'
    ) {
      post = await this.postsRepository.save(post);

      const postDto: PostsDto = new PostsDto();
      postDto.uploaderId = post.uploaderId.id;
      postDto.post_content = post.post_content;
      postDto.number_of_likes = post.number_of_likes;
      postDto.number_of_dislikes = post.number_of_dislikes;
      postDto.user_who_liked = post.users_liked || [];
      postDto.user_who_disliked = post.users_disliked || [];
      postDto.created_at = post.created_at;
      postDto.updated_at = post.updated_at;
      postDto.visibility = post.visibility;
      return postDto;
    } else
      throw new HttpException(
        'Invalid visibility: Can only be public,private,only me',
        HttpStatus.BAD_REQUEST,
      );
  }

  async userWhoLikedDisliked(authorization: string, postId, activityType) {
    const post = await this.postsRepository.findOne(postId, {
      relations: ['uploaderId'],
    });
    const userId = parseInt(
      await this.auth.getPayloadIdFromToken(authorization),
    );

    post.users_liked = post.users_liked || [];
    post.users_disliked = post.users_disliked || [];

    if (!post)
      throw new HttpException(
        'Such a post was not found',
        HttpStatus.BAD_REQUEST,
      );
    if (post.visibility == AccessModifiers.PUBLIC) {
      if (activityType === 'LIKE') {
        if (post.users_liked.includes(userId))
          throw new HttpException(
            'Already liked! Cannot Relike again',
            HttpStatus.BAD_REQUEST,
          );
        post.number_of_likes = post.number_of_likes + 1;
        post.users_liked.push(userId);
      } else {
        if (post.users_disliked.includes(userId))
          throw new HttpException(
            'Already disliked! Cannot dislike again',
            HttpStatus.BAD_REQUEST,
          );
        post.number_of_dislikes = post.number_of_dislikes + 1;
        post.users_disliked.push(userId);
      }
      await this.postsRepository.save(post);
    } else if (post.visibility == AccessModifiers.PRIVATE) {
      const Ids =
        await this.friendshipService.getFriendsIdOfCurrentlyLoggedInUser(
          authorization,
        );
      if (!Ids.length)
        throw new UnauthorizedException(
          'You are not authorized to like this post',
        );
      if (Ids.includes(post.uploaderId.id)) {
        if (activityType === 'LIKE') {
          if (post.users_liked.includes(userId))
            throw new HttpException(
              'Already liked! Cannot Relike again',
              HttpStatus.BAD_REQUEST,
            );
          post.number_of_likes = post.number_of_likes + 1;
          post.users_liked.push(userId);
        } else {
          if (post.users_disliked.includes(userId))
            throw new HttpException(
              'Already disliked! Cannot dislike again',
              HttpStatus.BAD_REQUEST,
            );
          post.number_of_dislikes = post.number_of_dislikes + 1;
          post.users_disliked.push(userId);
        }
        await this.postsRepository.save(post);
      }
    } else if (
      post.visibility == AccessModifiers.ME &&
      post.uploaderId.id == userId
    ) {
      if (activityType === 'LIKE') {
        if (post.users_liked.includes(userId))
          throw new HttpException(
            'Already liked! Cannot Relike again',
            HttpStatus.BAD_REQUEST,
          );
        post.number_of_likes = post.number_of_likes + 1;
        post.users_liked.push(userId);
      } else {
        if (post.users_disliked.includes(userId))
          throw new HttpException(
            'Already disliked! Cannot dislike again',
            HttpStatus.BAD_REQUEST,
          );
        post.number_of_dislikes = post.number_of_dislikes + 1;
        post.users_disliked.push(userId);
      }
      await this.postsRepository.save(post);
    } else
      throw new UnauthorizedException(
        'You are not authorized to like this post',
      );
  }

  async postAccessType(
    userId: number,
    postId: number,
    accessModifiers: string,
  ) {
    const post = await this.postsRepository.findOne(postId, {
      relations: ['uploaderId'], 
    });
    if (!post) throw new NotFoundException();
    post.uploaderId.id = userId;
    return this.postsRepository.changeAccessOfPost(postId, accessModifiers);
  }

  async getPostByUser(authorization: string) {
    const userid = parseInt(
      await this.auth.getPayloadIdFromToken(authorization),
    );
    return this.postsRepository.getPostByUser(userid);
  }

  async deletePost(postId: number, authorization: string) {
    try {
      const post = await this.postsRepository.findOne(postId, {
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
      if ((post.uploaderId.id! = userId))
        throw new HttpException(
          'You cant delete this post',
          HttpStatus.UNAUTHORIZED,
        );

      return this.postsRepository.deleteAPost(postId);
    } catch (error) {
      logger.error({
        level: 'error',
        message: error,
      });
      return error.message;
    }
  }

  async getAllPostInfo(postId: number, authorization: string) {
    const userId = parseInt(
      await this.auth.getPayloadIdFromToken(authorization),
    );
    const post = await this.postsRepository.findOne(postId, {
      relations: ['uploaderId'], 
    });
    if (!post) throw new NotFoundException('The particular post was not found');
    if (post.visibility == AccessModifiers.PUBLIC) {
      const postInfo = await this.postsRepository.getAllPostInfo(postId);
      return postInfo;
    } else if (
      post.visibility == AccessModifiers.ME &&
      post.uploaderId.id == userId
    ) {
      const postInfo = await this.postsRepository.getAllPostInfo(postId);
      return postInfo;
    } else if (post.visibility == AccessModifiers.PRIVATE) {
      const Ids =
        await this.friendshipService.getFriendsIdOfCurrentlyLoggedInUser(
          authorization,
        );
      Ids.push(userId);
      if (!Ids.length)
        throw new UnauthorizedException(
          'You are not authorized to view this post',
        );

      if (Ids.includes(post.uploaderId.id)) {
        const postInfo = await this.postsRepository.getAllPostInfo(postId);
        return postInfo;
      }
    } else
      throw new UnauthorizedException(
        'You are not authorized to view this post',
      );
  }
}
