import { EntityRepository, Repository } from 'typeorm';
import { AccessModifiers, Post } from './posts.entity';

@EntityRepository(Post)
export class PostsRepository extends Repository<Post> {
 
  deleteAPost(postId: number) {
    this.createQueryBuilder()
      .delete()
      .from(Post)
      .where('post_id = :id', { id: postId })
      .execute();
  }

  
  async getPostByUser(userid: number) {
    const userPost = await this.createQueryBuilder('post')
      .select('user.id', 'userId')
      .addSelect('user.firstName', 'userFirstName')
      .addSelect('user.lastName', 'userLastName')
      .addSelect('post.post_id', 'postId')
      .addSelect('post.post_content', 'content')
      .addSelect('post.number_of_likes', 'postLikes')
      .addSelect('post.users_liked', 'users who liked')
      .addSelect('post.users_disliked', 'users who disliked')
      .leftJoin('post.uploaderId', 'user')
      .where('post.user_id = :user_id', {
        user_id: userid,
      })
      .getRawMany();
    return userPost;
  }

  async getAllPostInfo(postId: number) {
    const postInfo = await this.createQueryBuilder('post')
      .innerJoinAndSelect('post.uploaderId', 'user')
      .leftJoinAndSelect('post.comments', 'comments')
      .where('post.post_id=:postId', { postId })
      .select('user.firstName', 'Author First Name')
      .addSelect('user.lastName', 'Author Last Name')
      .addSelect('post.post_content', 'Post Content')
      .addSelect('post.number_of_likes', 'Post Likes')
      .addSelect('post.number_of_dislikes', 'Post Dislikes')
      .addSelect('comments.content', 'Comment')
      .addSelect('comments.commenter_id', 'Commenter Id')
      .getRawMany();
    return postInfo;
  }

  async changeAccessOfPost(postId: number, accessModifiers: string) {
    if (accessModifiers === 'private') {
      await this.createQueryBuilder()
        .update(Post)
        .set({ visibility: AccessModifiers.PRIVATE })
        .where('post_id = :post_id', {
          post_id: postId,
        })
        .execute();
    }
    if (accessModifiers === 'only me') {
      await this.createQueryBuilder()
        .update(Post)
        .set({ visibility: AccessModifiers.ME })
        .where('post_id = :post_id', {
          post_id: postId,
        })
        .execute();
    }
    if (accessModifiers === 'public') {
      await this.createQueryBuilder()
        .update(Post)
        .set({ visibility: AccessModifiers.ME })
        .where('post_id = :post_id', {
          post_id: postId,
        })
        .execute();
    }
  }
}
