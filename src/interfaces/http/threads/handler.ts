import { Request, ResponseToolkit } from '@hapi/hapi';
import { Container } from 'instances-container';

import { ThreadPayloadSchema } from '@/commons/validations/thread-payload-validator';

import { AddThreadUseCase } from '@/applications/use_case/add-thread-use-case';
import { DetailThreadUseCase } from '@/applications/use_case/detail-thread-use-case';

class ThreadsHandler {
  private container: Container;
  constructor(container: Container) {
    this.container = container;
  }

  postThreadHandler = async (request: Request, h: ResponseToolkit) => {
    const validationResult = ThreadPayloadSchema.safeParse(request.payload);

    if (!validationResult.success) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const addThreadUseCase = this.container.getInstance(AddThreadUseCase.name);

    const addedThread = await addThreadUseCase.execute({
      ...validationResult.data,
      userId: request.auth.credentials.userId,
    });

    return h
      .response({
        status: 'success',
        data: {
          addedThread,
        },
      })
      .code(201);
  };

  getThreadHandler = async (request: Request, h: ResponseToolkit) => {
    const threadId = request.params.threadId;

    const detailThreadUseCase = this.container.getInstance(
      DetailThreadUseCase.name,
    ) as DetailThreadUseCase;

    const thread = await detailThreadUseCase.execute({
      threadId,
    });

    return h
      .response({
        status: 'success',
        data: {
          thread,
        },
      })
      .code(200);
  };
}

export { ThreadsHandler };
