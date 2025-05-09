import { CommentRepository } from '@/domains/comments/comment-repository';
import { ReplyRepository } from '@/domains/replies/reply-repository';
import { ThreadRepository } from '@/domains/threads/thread-repository';

interface DetailThreadUseCasePayload {
  threadId: string;
}

interface DetailThreadUseCaseDependencies {
  threadRepository: ThreadRepository;
  commentRepository: CommentRepository;
  replyRepository: ReplyRepository;
}

class DetailThreadUseCase {
  private threadRepository: ThreadRepository;
  private commentRepository: CommentRepository;
  private replyRepository: ReplyRepository;

  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
  }: DetailThreadUseCaseDependencies) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.replyRepository = replyRepository;
  }

  async execute(useCasePayload: DetailThreadUseCasePayload) {
    const { threadId } = useCasePayload;

    const isAvailable =
      await this.threadRepository.verifyAvailableThread(threadId);
    if (!isAvailable) {
      throw new Error('THREAD_NOT_FOUND');
    }

    const thread = await this.threadRepository.getThreadById(threadId);
    const comments = await this.commentRepository.getCommentsByThreadIds([
      threadId,
    ]);
    const commentIds = comments.map((comment) => comment.id);
    const replies =
      await this.replyRepository.getRepliesByCommentIds(commentIds);

    const mappedComments = comments.map((comment) => ({
      ...comment,
      replies: replies
        .filter((reply) => reply.commentId === comment.id)
        .map((reply) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { commentId, ...row } = reply;
          return {
            ...row,
          };
        }),
    }));

    return {
      ...thread,
      comments: mappedComments,
    };
  }
}

export { DetailThreadUseCase };
