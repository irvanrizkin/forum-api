import { CommentRepository } from '@/domains/comments/comment-repository';
import { ThreadRepository } from '@/domains/threads/thread-repository';

interface DeleteCommentUseCasePayload {
  commentId: string;
  threadId: string;
  userId: string;
}

interface DeleteCommentUseCaseDependencies {
  commentRepository: CommentRepository;
  threadRepository: ThreadRepository;
}

class DeleteCommentUseCase {
  private commentRepository: CommentRepository;
  private threadRepository: ThreadRepository;

  constructor({
    commentRepository,
    threadRepository,
  }: DeleteCommentUseCaseDependencies) {
    this.commentRepository = commentRepository;
    this.threadRepository = threadRepository;
  }

  async execute(useCasePayload: DeleteCommentUseCasePayload): Promise<void> {
    const { commentId, threadId, userId } = useCasePayload;

    const isAvailableThread =
      await this.threadRepository.verifyAvailableThread(threadId);

    if (!isAvailableThread) {
      throw new Error('THREAD_NOT_FOUND');
    }

    const isAvailableComment =
      await this.commentRepository.verifyAvailableComment(commentId);

    if (!isAvailableComment) {
      throw new Error('COMMENT_NOT_FOUND');
    }

    const isCommentOwner = await this.commentRepository.verifyCommentOwner(
      commentId,
      userId,
    );

    if (!isCommentOwner) {
      throw new Error('COMMENT_NOT_OWNER');
    }

    return this.commentRepository.deleteComment(commentId);
  }
}

export { DeleteCommentUseCase };
