import { AddThread } from '@/domains/threads/entities/add-thread';
import { AddedThread } from '@/domains/threads/entities/added-thread';

abstract class ThreadRepository {
  abstract addThread(thread: AddThread): Promise<AddedThread>;
}

export { ThreadRepository };
