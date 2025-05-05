import { ThreadRepository } from '@/domains/threads/thread-repository';

class MockThreadRepository extends ThreadRepository {
  addThread = jest.fn();
  verifyAvailableThread = jest.fn();
  getThreadById = jest.fn();
}

export { MockThreadRepository };
