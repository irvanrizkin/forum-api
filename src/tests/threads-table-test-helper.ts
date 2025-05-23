/* istanbul ignore file */
import { pool } from '@/infrastructures/database/postgres/pool';

interface ThreadPayload {
  id: string;
  title: string;
  body: string;
  userId: string;
}

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-1',
    title = 'Thread Title',
    body = 'Thread Body',
    userId = 'user-1',
  }: ThreadPayload): Promise<void> {
    const query = {
      text: 'INSERT INTO threads (id, title, body, user_id) VALUES($1, $2, $3, $4)',
      values: [id, title, body, userId],
    };

    await pool.query(query);
  },

  async findThreadById(id: string): Promise<unknown[]> {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE threads CASCADE');
  },
};

export { ThreadsTableTestHelper };
