import { Pool } from 'pg';

import { AddedReply } from '@/domains/replies/entities/added-reply';
import { Reply } from '@/domains/replies/entities/reply';
import { ReplyRepository } from '@/domains/replies/reply-repository';

class ReplyRepositoryPostgres implements ReplyRepository {
  private pool: Pool;
  private idGenerator: () => string;
  constructor(pool: Pool, idGenerator: () => string) {
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addReply({
    content,
    commentId,
    userId,
  }: {
    content: string;
    commentId: string;
    userId: string;
  }): Promise<AddedReply> {
    const id = this.idGenerator();
    const query = {
      text: 'INSERT INTO replies(id, content, comment_id, user_id) VALUES($1, $2, $3, $4) RETURNING id, content, user_id',
      values: [id, content, commentId, userId],
    };

    const result = await this.pool.query(query);

    return new AddedReply({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].user_id,
    });
  }

  async getRepliesByCommentIds(commentIds: string[]): Promise<Reply[]> {
    const query = {
      text: 'SELECT r.id, r.content, r.date, u.username, r.is_delete FROM replies r LEFT JOIN users u ON u.id = r.user_id WHERE comment_id = ANY($1)',
      values: [commentIds],
    };

    const result = await this.pool.query(query);
    return result.rows.map(({ is_delete, ...row }) => ({
      ...row,
      content: is_delete ? '**balasan telah dihapus**' : row.content,
    }));
  }

  async deleteReply(replyId: string): Promise<void> {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [replyId],
    };

    await this.pool.query(query);
  }

  async verifyAvailableReply(replyId: string): Promise<boolean> {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) {
      return false;
    }
    return true;
  }

  async verifyReplyOwner(replyId: string, userId: string): Promise<boolean> {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND user_id = $2',
      values: [replyId, userId],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) {
      return false;
    }
    return true;
  }
}

export { ReplyRepositoryPostgres };
