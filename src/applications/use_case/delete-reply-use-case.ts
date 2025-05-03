import { CommentRepository } from '@/domains/comments/comment-repository';
import { ReplyRepository } from '@/domains/replies/reply-repository';
import { ThreadRepository } from '@/domains/threads/thread-repository';

interface DeleteReplyUseCasePayload {
  replyId: string;
  commentId: string;
  threadId: string;
  userId: string;
}

interface DeleteReplyUseCaseDependencies {
  replyRepository: ReplyRepository;
  commentRepository: CommentRepository;
  threadRepository: ThreadRepository;
}

class DeleteReplyUseCase {
  private replyRepository: ReplyRepository;
  private commentRepository: CommentRepository;
  private threadRepository: ThreadRepository;

  constructor({
    replyRepository,
    commentRepository,
    threadRepository,
  }: DeleteReplyUseCaseDependencies) {
    this.replyRepository = replyRepository;
    this.commentRepository = commentRepository;
    this.threadRepository = threadRepository;
  }

  async execute(useCasePayload: DeleteReplyUseCasePayload): Promise<void> {
    const { replyId, commentId, threadId, userId } = useCasePayload;

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

    const isAvailableReply =
      await this.replyRepository.verifyAvailableReply(replyId);
    if (!isAvailableReply) {
      throw new Error('REPLY_NOT_FOUND');
    }

    const isReplyOwner = await this.replyRepository.verifyReplyOwner(
      replyId,
      userId,
    );
    if (!isReplyOwner) {
      throw new Error('REPLY_NOT_OWNER');
    }

    return this.replyRepository.deleteReply(replyId);
  }
}

export { DeleteReplyUseCase };
