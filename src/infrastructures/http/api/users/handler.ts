import { Request, ResponseToolkit } from '@hapi/hapi';
import { Container } from 'instances-container';

import { AddUserUseCase } from '@/applications/use_case/add-user-use-case';

class UsersHandler {
  private container: Container;
  constructor(container: Container) {
    this.container = container;
  }

  postUserHandler = async (request: Request, h: ResponseToolkit) => {
    const addUserUseCase = this.container.getInstance(AddUserUseCase.name);
    const addedUser = await addUserUseCase.execute(request.payload);

    return h
      .response({
        status: 'success',
        data: {
          addedUser,
        },
      })
      .code(201);
  };
}

export { UsersHandler };
