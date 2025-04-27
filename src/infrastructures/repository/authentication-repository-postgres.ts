import { Pool } from 'pg';

import { InvariantError } from '@/commons/exceptions/invariant-error';

import { AuthenticationRepository } from '@/domains/authentications/authentication-repository';

class AuthenticationRepositoryPostgres implements AuthenticationRepository {
  private pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  async addToken(token: string): Promise<void> {
    const query = {
      text: 'INSERT INTO authentications VALUES ($1)',
      values: [token],
    };

    await this.pool.query(query);
  }

  async checkAvailabilityToken(token: string): Promise<void> {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this.pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError('refresh token tidak ditemukan di database');
    }
  }

  async deleteToken(token: string): Promise<void> {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this.pool.query(query);
  }
}

export { AuthenticationRepositoryPostgres };
