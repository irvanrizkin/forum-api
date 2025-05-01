import { AddedThread } from '@/domains/threads/entities/added-thread';

interface AddThreadParameter {
  title: string;
  body: string;
  userId: string;
}

abstract class ThreadRepository {
  abstract addThread(thread: AddThreadParameter): Promise<AddedThread>;
  abstract verifyAvailableThread(threadId: string): Promise<boolean>;
}

export { ThreadRepository };
