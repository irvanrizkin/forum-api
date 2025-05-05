import { AddedThread } from '@/domains/threads/entities/added-thread';
import { Thread } from '@/domains/threads/entities/thread';

interface AddThreadParameter {
  title: string;
  body: string;
  userId: string;
}

abstract class ThreadRepository {
  abstract addThread(thread: AddThreadParameter): Promise<AddedThread>;
  abstract verifyAvailableThread(threadId: string): Promise<boolean>;
  abstract getThreadById(threadId: string): Promise<Thread>;
}

export { ThreadRepository, AddThreadParameter };
