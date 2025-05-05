import { Pool } from 'pg';

import { AddedThread } from '@/domains/threads/entities/added-thread';
import { Thread } from '@/domains/threads/entities/thread';
import {
  AddThreadParameter,
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

  async addThread(thread: AddThreadParameter): Promise<AddedThread> {
    const { title, body, userId } = thread;
    const id = `${this.idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads (id, title, body, owner) VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, userId],
    };

    const result = await this.pool.query(query);

    return new AddedThread({
      id: result.rows[0].id,
      title: result.rows[0].title,
      owner: result.rows[0].owner,
    });
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

  async getThreadById(threadId: string): Promise<Thread> {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username
             FROM threads
             LEFT JOIN users ON users.id = threads.owner
             WHERE threads.id = $1`,
      values: [threadId],
    };

    const result = await this.pool.query<RawThread>(query);

    if (!result.rowCount) {
      throw new Error('THREAD_NOT_FOUND');
    }

    const thread = result.rows[0];

    return new Thread({
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date.toISOString(),
      username: thread.username,
    });
  }
}

export { ThreadRepositoryPostgres };
