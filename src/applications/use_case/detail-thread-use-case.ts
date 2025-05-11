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

    const mappedComments = comments.map((comment) => {
      const content = comment.is_delete
        ? '**komentar telah dihapus**'
        : comment.content;

      return {
        id: comment.id,
        content,
        date: comment.date,
        username: comment.username,
        replies: replies
          .filter((reply) => reply.comment_id === comment.id)
          .map((reply) => {
            const content = reply.is_delete
              ? '**balasan telah dihapus**'
              : reply.content;

            return {
              id: reply.id,
              content,
              date: reply.date,
              username: reply.username,
            };
          }),
      };
    });

    return {
      ...thread,
      comments: mappedComments,
    };
  }
}

export { DetailThreadUseCase };
