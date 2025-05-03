import { CommentRepository } from '@/domains/comments/comment-repository';
import { AddedReply } from '@/domains/replies/entities/added-reply';
import { ReplyRepository } from '@/domains/replies/reply-repository';
import { ThreadRepository } from '@/domains/threads/thread-repository';

interface AddReplyUseCasePayload {
  content: string;
  commentId: string;
  threadId: string;
  userId: string;
}

interface AddReplyUseCaseDependencies {
  replyRepository: ReplyRepository;
  commentRepository: CommentRepository;
  threadRepository: ThreadRepository;
}

class AddReplyUseCase {
  private replyRepository: ReplyRepository;
  private commentRepository: CommentRepository;
  private threadRepository: ThreadRepository;

  constructor({
    replyRepository,
    commentRepository,
    threadRepository,
  }: AddReplyUseCaseDependencies) {
    this.replyRepository = replyRepository;
    this.commentRepository = commentRepository;
    this.threadRepository = threadRepository;
  }

  async execute(useCasePayload: AddReplyUseCasePayload): Promise<AddedReply> {
    const { content, commentId, threadId, userId } = useCasePayload;

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

    return this.replyRepository.addReply({
      content,
      commentId,
      threadId,
      userId,
    });
  }
}

export { AddReplyUseCase };
