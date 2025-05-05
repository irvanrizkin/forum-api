/* istanbul ignore file */
import { pool } from '@/infrastructures/database/postgres/pool';

interface AddUserPayload {
  id?: string;
  username?: string;
  password?: string;
  fullname?: string;
}

const UsersTableTestHelper = {
  async addUser({
    id = 'user-1',
    username = 'john',
    password = 'secret',
    fullname = 'John Doe',
  }: AddUserPayload): Promise<void> {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
      values: [id, username, password, fullname],
    };

    await pool.query(query);
  },

  async findUserById(id: string): Promise<unknown[]> {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE users CASCADE');
  },
};

export { UsersTableTestHelper };
