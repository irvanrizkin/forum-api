import { Pool } from 'pg';

import {
  AddThreadParameter,
  RawAddedThread,
  ThreadRepository,
} from '@/domains/threads/thread-repository';

interface RawThread {
  id: string;
  title: string;
  body: string;
  date: Date;
  username: string;
}

class ThreadRepositoryPostgres implements ThreadRepository {
  private pool: Pool;
  private idGenerator: () => string;
  constructor(pool: Pool, idGenerator: () => string) {
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addThread(thread: AddThreadParameter): Promise<RawAddedThread> {
    const { title, body, userId } = thread;
    const id = `${this.idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads (id, title, body, user_id) VALUES($1, $2, $3, $4) RETURNING id, title, user_id',
      values: [id, title, body, userId],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async verifyAvailableThread(threadId: string): Promise<boolean> {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      return false;
    }

    return true;
  }

  async getThreadById(threadId: string): Promise<RawThread> {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username
             FROM threads
             LEFT JOIN users ON users.id = threads.user_id
             WHERE threads.id = $1`,
      values: [threadId],
    };

    const result = await this.pool.query<RawThread>(query);

    if (!result.rowCount) {
      throw new Error('THREAD_NOT_FOUND');
    }

    return result.rows[0];
  }
}

export { ThreadRepositoryPostgres };
