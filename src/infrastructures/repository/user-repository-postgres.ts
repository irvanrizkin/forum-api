import { Pool } from 'pg';

import { InvariantError } from '@/commons/exceptions/invariant-error';

import { RegisterUser } from '@/domains/users/entities/register-user';
import { RegisteredUser } from '@/domains/users/entities/registered-user';
import { UserRepository } from '@/domains/users/user-repository';

class UserRepositoryPostgres implements UserRepository {
  private pool: Pool;
  private idGenerator: () => string;
  constructor(pool: Pool, idGenerator: () => string) {
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async verifyAvailableUsername(username: string) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.pool.query(query);

    if (result.rowCount) {
      throw new Error('REGISTER_USER.USERNAME_NOT_AVAILABLE');
    }
  }

  async addUser(registerUser: RegisterUser) {
    const { username, password, fullname } = registerUser;
    const id = `${this.idGenerator()}`;

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
      values: [id, username, password, fullname],
    };

    const result = await this.pool.query(query);

    return new RegisteredUser({
      id: result.rows[0].id,
      username: result.rows[0].username,
      fullname: result.rows[0].fullname,
    });
  }

  async getIdByUsername(username: string): Promise<string> {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('username tidak ditemukan');
    }

    return result.rows[0].id;
  }

  async getPasswordByUsername(username: string): Promise<string> {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('user tidak ditemukan');
    }

    return result.rows[0].password;
  }
}

export { UserRepositoryPostgres };
