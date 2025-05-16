import { CommentRepository } from '@/domains/comments/comment-repository';
import { LikeRepository } from '@/domains/likes/like-repository';
import { ThreadRepository } from '@/domains/threads/thread-repository';

interface LikeCommentUseCasePayload {
  threadId: string;
  commentId: string;
  userId: string;
}

interface LikeCommentUseCaseDependencies {
  commentRepository: CommentRepository;
  threadRepository: ThreadRepository;
  likeRepository: LikeRepository;
}

class LikeCommentUseCase {
  private commentRepository: CommentRepository;
  private threadRepository: ThreadRepository;
  private likeRepository: LikeRepository;

  constructor({
    commentRepository,
    threadRepository,
    likeRepository,
  }: LikeCommentUseCaseDependencies) {
    this.commentRepository = commentRepository;
    this.threadRepository = threadRepository;
    this.likeRepository = likeRepository;
  }

  async execute(useCasePayload: LikeCommentUseCasePayload): Promise<void> {
    const { threadId, commentId, userId } = useCasePayload;

    const isThreadAvailable =
      await this.threadRepository.verifyAvailableThread(threadId);
    if (!isThreadAvailable) {
      throw new Error('THREAD_NOT_FOUND');
    }

    const isCommentAvailable =
      await this.commentRepository.verifyAvailableComment(commentId);
    if (!isCommentAvailable) {
      throw new Error('COMMENT_NOT_FOUND');
    }

    const isLiked = await this.likeRepository.isCommentLiked({
      commentId,
      userId,
    });

    if (isLiked) {
      return await this.likeRepository.unlikeComment({
        commentId,
        userId,
      });
    }
    await this.likeRepository.likeComment({
      commentId,
      userId,
    });
  }
}

export { LikeCommentUseCase };
