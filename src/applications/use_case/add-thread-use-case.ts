import { AddThread } from '@/domains/threads/entities/add-thread';
import { AddedThread } from '@/domains/threads/entities/added-thread';
import { ThreadRepository } from '@/domains/threads/thread-repository';

interface AddThreadUseCasePayload {
  title: string;
  body: string;
  userId: string;
}

interface AddThreadUseCaseDependencies {
  threadRepository: ThreadRepository;
}

class AddThreadUseCase {
  private threadRepository: ThreadRepository;

  constructor({ threadRepository }: AddThreadUseCaseDependencies) {
    this.threadRepository = threadRepository;
  }

  async execute(useCasePayload: AddThreadUseCasePayload) {
    const { title, body, userId } = useCasePayload;

    const addThread = new AddThread({
      title,
      body,
    });

    const addedThread = await this.threadRepository.addThread({
      title: addThread.title,
      body: addThread.body,
      userId,
    });

    return new AddedThread({
      id: addedThread.id,
      title: addThread.title,
      owner: userId,
    });
  }
}

export { AddThreadUseCase };
