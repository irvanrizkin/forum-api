import { ThreadRepository } from '@/domains/threads/thread-repository';

interface DetailThreadUseCasePayload {
  threadId: string;
}

interface DetailThreadUseCaseDependencies {
  threadRepository: ThreadRepository;
}

class DetailThreadUseCase {
  private threadRepository: ThreadRepository;

  constructor({ threadRepository }: DetailThreadUseCaseDependencies) {
    this.threadRepository = threadRepository;
  }

  async execute(useCasePayload: DetailThreadUseCasePayload) {
    const { threadId } = useCasePayload;

    const isAvailable =
      await this.threadRepository.verifyAvailableThread(threadId);
    if (!isAvailable) {
      throw new Error('THREAD_NOT_FOUND');
    }

    return this.threadRepository.getThreadById(threadId);
  }
}

export { DetailThreadUseCase };
