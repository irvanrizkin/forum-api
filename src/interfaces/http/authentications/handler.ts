import { Request, ResponseToolkit } from '@hapi/hapi';
import { Container } from 'instances-container';

import {
  AuthenticationPayloadSchema,
  RefreshTokenPayloadSchema,
} from '@/commons/validations/authentication-payload-validator';

import { LoginUserUseCase } from '@/applications/use_case/login-user-use-case';
import { LogoutUserUseCase } from '@/applications/use_case/logout-user-use-case';
import { RefreshAuthenticationUseCase } from '@/applications/use_case/refresh-authentication-use-case';

class AuthenticationsHandler {
  private container: Container;
  constructor(container: Container) {
    this.container = container;
  }

  postAuthenticationHandler = async (request: Request, h: ResponseToolkit) => {
    const validationResult = AuthenticationPayloadSchema.safeParse(
      request.payload,
    );

    if (!validationResult.success) {
      throw new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const loginUserUseCase = this.container.getInstance(LoginUserUseCase.name);
    const { accessToken, refreshToken } = await loginUserUseCase.execute(
      request.payload,
    );

    return h
      .response({
        status: 'success',
        data: {
          accessToken,
          refreshToken,
        },
      })
      .code(201);
  };

  putAuthenticationHandler = async (request: Request, h: ResponseToolkit) => {
    const validationResult = RefreshTokenPayloadSchema.safeParse(
      request.payload,
    );

    if (!validationResult.success) {
      throw new Error('REFRESH_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const refreshAuthenticationUseCase = this.container.getInstance(
      RefreshAuthenticationUseCase.name,
    );
    const accessToken = await refreshAuthenticationUseCase.execute(
      request.payload,
    );

    return h
      .response({
        status: 'success',
        data: {
          accessToken,
        },
      })
      .code(200);
  };

  deleteAuthenticationHandler = async (
    request: Request,
    h: ResponseToolkit,
  ) => {
    const validationResult = RefreshTokenPayloadSchema.safeParse(
      request.payload,
    );

    if (!validationResult.success) {
      throw new Error('DELETE_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const logoutUserUseCase = this.container.getInstance(
      LogoutUserUseCase.name,
    );
    await logoutUserUseCase.execute(request.payload);

    return h
      .response({
        status: 'success',
      })
      .code(200);
  };
}

export { AuthenticationsHandler };
