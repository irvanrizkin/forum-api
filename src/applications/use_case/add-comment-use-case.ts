import { CommentRepository } from '@/domains/comments/comment-repository';
import { AddedComment } from '@/domains/comments/entities/added-comment';
import { ThreadRepository } from '@/domains/threads/thread-repository';

interface AddCommentUseCasePayload {
  content: string;
  threadId: string;
  userId: string;
}

interface AddCommentUseCaseDependencies {
  commentRepository: CommentRepository;
  threadRepository: ThreadRepository;
}

class AddCommentUseCase {
  private commentRepository: CommentRepository;
  private threadRepository: ThreadRepository;

  constructor({
    commentRepository,
    threadRepository,
  }: AddCommentUseCaseDependencies) {
    this.commentRepository = commentRepository;
    this.threadRepository = threadRepository;
  }

  async execute(
    useCasePayload: AddCommentUseCasePayload,
  ): Promise<AddedComment> {
    const { content, threadId, userId } = useCasePayload;

    const isAvailable =
      await this.threadRepository.verifyAvailableThread(threadId);

    if (!isAvailable) {
      throw new Error('THREAD_NOT_FOUND');
    }

    const addedComment = await this.commentRepository.addComment({
      content,
      threadId,
      userId,
    });

    return new AddedComment({
      id: addedComment.id,
      content: addedComment.content,
      owner: addedComment.user_id,
    });
  }
}

export { AddCommentUseCase };
