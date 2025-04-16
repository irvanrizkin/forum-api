import { pool } from '../src/infrastructures/database/postgres/pool';

const AuthenticationsTableTestHelper = {
  async addUser(token: string): Promise<void> {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await pool.query(query);
  },

  async findUserById(token: string): Promise<unknown[]> {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE authentications');
  },
};

export { AuthenticationsTableTestHelper };
