interface AddThreadParameter {
  title: string;
  body: string;
  userId: string;
}

interface RawThread {
  id: string;
  title: string;
  body: string;
  date: Date;
  username: string;
}

interface RawAddedThread {
  id: string;
  title: string;
  user_id: string;
}

abstract class ThreadRepository {
  abstract addThread(thread: AddThreadParameter): Promise<RawAddedThread>;
  abstract verifyAvailableThread(threadId: string): Promise<boolean>;
  abstract getThreadById(threadId: string): Promise<RawThread>;
}

export { ThreadRepository, AddThreadParameter, RawThread, RawAddedThread };
