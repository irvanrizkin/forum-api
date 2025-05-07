/* istanbul ignore file */
import { pool } from '@/infrastructures/database/postgres/pool';

interface ReplyPayload {
  id: string;
  content: string;
  userId: string;
  commentId: string;
}

interface ReplyHelperResult {
  id: string;
  date: Date;
  content: string;
  is_delete: boolean;
  user_id: string;
  comment_id: string;
}

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-1',
    content = 'Reply Content',
    userId = 'user-123',
    commentId = 'comment-123',
  }: ReplyPayload): Promise<void> {
    const query = {
      text: 'INSERT INTO replies (id, content, user_id, comment_id) VALUES($1, $2, $3, $4)',
      values: [id, content, userId, commentId],
    };

    await pool.query(query);
  },

  async findReplyById(id: string): Promise<ReplyHelperResult[]> {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE replies CASCADE');
  },
};

export { RepliesTableTestHelper };
