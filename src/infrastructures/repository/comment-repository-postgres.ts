import { Pool } from 'pg';

import {
  AddCommentParameter,
  CommentRepository,
  RawAddedComment,
  RawComment,
} from '@/domains/comments/comment-repository';

class CommentRepositoryPostgres implements CommentRepository {
  private pool: Pool;
  private idGenerator: () => string;
  constructor(pool: Pool, idGenerator: () => string) {
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addComment({
    content,
    threadId,
    userId,
  }: AddCommentParameter): Promise<RawAddedComment> {
    const id = this.idGenerator();
    const query = {
      text: 'INSERT INTO comments(id, content, thread_id, user_id) VALUES($1, $2, $3, $4) RETURNING id, content, user_id',
      values: [id, content, threadId, userId],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async getCommentsByThreadIds(threadIds: string[]): Promise<RawComment[]> {
    const query = {
      text: `
        SELECT
          c.id,
          c.content,
          c.date,
          u.username,
          c.is_delete
        FROM comments c
        LEFT JOIN users u ON u.id = c.user_id
        WHERE thread_id = ANY($1)
        ORDER BY c.date ASC
      `,
      values: [threadIds],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async deleteComment(commentId: string): Promise<void> {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    };

    await this.pool.query(query);
  }

  async verifyAvailableComment(commentId: string): Promise<boolean> {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) {
      return false;
    }
    return true;
  }

  async verifyCommentOwner(
    commentId: string,
    userId: string,
  ): Promise<boolean> {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) {
      return false;
    }
    return true;
  }
}

export { CommentRepositoryPostgres };
