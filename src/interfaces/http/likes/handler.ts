import { Request, ResponseToolkit } from '@hapi/hapi';
import { Container } from 'instances-container';

import { LikeCommentUseCase } from '@/applications/use_case/like-comment-use-case';

class LikesHandler {
  private container: Container;
  constructor(container: Container) {
    this.container = container;
  }

  putLikeCommentHandler = async (request: Request, h: ResponseToolkit) => {
    const likeCommentUseCase = this.container.getInstance(
      LikeCommentUseCase.name,
    ) as LikeCommentUseCase;

    await likeCommentUseCase.execute({
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      userId: request.auth.credentials.userId as string,
    });

    return h
      .response({
        status: 'success',
      })
      .code(200);
  };
}

export { LikesHandler };
