/* istanbul ignore file */
import { pool } from '@/infrastructures/database/postgres/pool';

interface CommentPayload {
  id: string;
  content: string;
  userId: string;
  threadId: string;
}

interface CommentHelperResult {
  id: string;
  date: Date;
  content: string;
  is_delete: boolean;
  user_id: string;
  thread_id: string;
}

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-1',
    content = 'Comment Content',
    userId = 'user-123',
    threadId = 'thread-123',
  }: CommentPayload): Promise<void> {
    const query = {
      text: 'INSERT INTO comments (id, content, user_id, thread_id) VALUES($1, $2, $3, $4)',
      values: [id, content, userId, threadId],
    };

    await pool.query(query);
  },

  async findCommentById(id: string): Promise<CommentHelperResult[]> {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE comments CASCADE');
  },
};

export { CommentsTableTestHelper };
