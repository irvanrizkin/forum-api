/* istanbul ignore file */
import { pool } from '@/infrastructures/database/postgres/pool';

interface CommentLikePayload {
  id: string;
  commentId: string;
  userId: string;
}

interface FindCommentPayload {
  commentId: string;
  userId: string;
}

const CommentLikesTableTestHelper = {
  async addCommentLike({
    id = 'comment-like-1',
    commentId = 'comment-123',
    userId = 'user-123',
  }: CommentLikePayload): Promise<void> {
    const query = {
      text: 'INSERT INTO comment_likes (id, comment_id, user_id) VALUES($1, $2, $3)',
      values: [id, commentId, userId],
    };

    await pool.query(query);
  },

  async findCommentLikeByUserIdAndCommentId({
    userId,
    commentId,
  }: FindCommentPayload): Promise<CommentLikePayload[]> {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findCommentLikeCountByCommentId(commentId: string): Promise<number> {
    const query = {
      text: 'SELECT COUNT(*) FROM comment_likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await pool.query(query);
    return Number.parseInt(result.rows[0].count, 10);
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE comment_likes CASCADE');
  },
};

export { CommentLikesTableTestHelper };
