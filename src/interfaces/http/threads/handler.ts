import { Request, ResponseToolkit } from '@hapi/hapi';
import { Container } from 'instances-container';

import { ThreadPayloadSchema } from '@/commons/validations/thread-payload-validator';

import { AddThreadUseCase } from '@/applications/use_case/add-thread-use-case';

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
}

export { ThreadsHandler };
