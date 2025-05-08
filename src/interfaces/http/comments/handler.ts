import { Request, ResponseToolkit } from '@hapi/hapi';
import { Container } from 'instances-container';

import { CommentPayloadSchema } from '@/commons/validations/comment-payload-validator';

import { AddCommentUseCase } from '@/applications/use_case/add-comment-use-case';

class CommentsHandler {
  private container: Container;
  constructor(container: Container) {
    this.container = container;
  }

  postCommentHandler = async (request: Request, h: ResponseToolkit) => {
    const validationResult = CommentPayloadSchema.safeParse(request.payload);

    if (!validationResult.success) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const addCommentUseCase = this.container.getInstance(
      AddCommentUseCase.name,
    ) as AddCommentUseCase;

    const addedComment = await addCommentUseCase.execute({
      ...validationResult.data,
      threadId: request.params.threadId,
      userId: request.auth.credentials.userId as string,
    });

    return h
      .response({
        status: 'success',
        data: {
          addedComment,
        },
      })
      .code(201);
  };
}

export { CommentsHandler };
