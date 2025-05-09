import { Request, ResponseToolkit } from '@hapi/hapi';
import { Container } from 'instances-container';

import { ReplyPayloadSchema } from '@/commons/validations/reply-payload-validator';

import { AddReplyUseCase } from '@/applications/use_case/add-reply-use-case';
import { DeleteReplyUseCase } from '@/applications/use_case/delete-reply-use-case';

class RepliesHandler {
  private container: Container;
  constructor(container: Container) {
    this.container = container;
  }

  postReplyHandler = async (request: Request, h: ResponseToolkit) => {
    const validationResult = ReplyPayloadSchema.safeParse(request.payload);

    if (!validationResult.success) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const addReplyUseCase = this.container.getInstance(
      AddReplyUseCase.name,
    ) as AddReplyUseCase;

    const addedReply = await addReplyUseCase.execute({
      ...validationResult.data,
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      userId: request.auth.credentials.userId as string,
    });

    return h
      .response({
        status: 'success',
        data: {
          addedReply,
        },
      })
      .code(201);
  };

  deleteReplyHandler = async (request: Request, h: ResponseToolkit) => {
    const deleteReplyUseCase = this.container.getInstance(
      DeleteReplyUseCase.name,
    ) as DeleteReplyUseCase;

    await deleteReplyUseCase.execute({
      replyId: request.params.replyId,
      commentId: request.params.commentId,
      threadId: request.params.threadId,
      userId: request.auth.credentials.userId as string,
    });

    return h
      .response({
        status: 'success',
        message: 'balasan berhasil dihapus',
      })
      .code(200);
  };
}

export { RepliesHandler };
