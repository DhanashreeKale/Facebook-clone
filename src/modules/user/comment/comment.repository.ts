import { EntityRepository, Repository } from 'typeorm';
import { Comments } from './comment.entity';

@EntityRepository(Comments)
export class CommentsRepository extends Repository<Comments> {
  async deleteComment(requestObject: number) {
    await this.createQueryBuilder()
      .delete()
      .from(Comments)
      .where('id = :id', { id: requestObject })
      .execute();
  }
  async getCommentByPost(postid: number) {
    const postComments = await this.createQueryBuilder('comments')
      .select('post.post_id', 'postId')
      .addSelect('post.post_content', 'postContent')
      .addSelect('comments.content', 'commentContent')
      .addSelect('comments.commenter_id', 'commenterId')
      .leftJoin('comments.post', 'post')
      .where('comments.post_id = :post_id', {
        post_id: postid,
      })
      .getRawMany();
    return postComments;
  }
}
