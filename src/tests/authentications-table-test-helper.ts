import { pool } from '@/infrastructures/database/postgres/pool';

interface TokenPayload {
  token: string;
}

const AuthenticationsTableTestHelper = {
  async addToken(token: string): Promise<void> {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await pool.query(query);
  },

  async findToken(token: string): Promise<TokenPayload[]> {
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
