import { Pool } from 'pg';

import {
  CommentLikeParameter,
  LikeCount,
  LikeRepository,
} from '@/domains/likes/like-repository';

class LikeRepositoryPostgres implements LikeRepository {
  private pool: Pool;
  private idGenerator: () => string;
  constructor(pool: Pool, idGenerator: () => string) {
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async likeComment({
    commentId,
    userId,
  }: CommentLikeParameter): Promise<void> {
    const id = this.idGenerator();
    const query = {
      text: 'INSERT INTO comment_likes(id, comment_id, user_id) VALUES($1, $2, $3)',
      values: [id, commentId, userId],
    };

    await this.pool.query(query);
  }

  async unlikeComment({
    commentId,
    userId,
  }: CommentLikeParameter): Promise<void> {
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    await this.pool.query(query);
  }

  async isCommentLiked({
    commentId,
    userId,
  }: CommentLikeParameter): Promise<boolean> {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const result = await this.pool.query(query);

    return (result.rowCount ?? 0) > 0;
  }

  async getLikeCountByCommentIds(commentIds: string[]): Promise<LikeCount[]> {
    const query = {
      text: `
      WITH comment_ids AS (
        SELECT UNNEST($1::text[]) AS comment_id
      )
      SELECT
        c.comment_id,
        COUNT(cl.*) AS count
      FROM comment_ids c
      LEFT JOIN comment_likes cl ON cl.comment_id = c.comment_id
      GROUP BY c.comment_id
      `,
      values: [commentIds],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }
}

export { LikeRepositoryPostgres };
