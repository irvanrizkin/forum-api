import Hapi, { Request, ResponseToolkit } from '@hapi/hapi';
import Jwt from '@hapi/jwt';
import { Container } from 'instances-container';

import { config } from '@/commons/config';
import { ClientError } from '@/commons/exceptions/client-error';
import { DomainErrorTranslator } from '@/commons/exceptions/domain-error-translator';

import { authenticationsPlugin } from '@/interfaces/http/authentications';
import { threadsPlugin } from '@/interfaces/http/threads';
import { usersPlugin } from '@/interfaces/http/users';

const createServer = async (container: Container) => {
  const server = Hapi.server({
    host: config.app.host,
    port: config.app.port,
    debug: config.app.debug,
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('forumapi_jwt', 'jwt', {
    keys: config.tokenizer.accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.tokenizer.accessTokenAge,
    },
    validate: (artifacts: {
      decoded: {
        payload: {
          id: string;
        };
      };
    }) => {
      return {
        isValid: true,
        credentials: {
          userId: artifacts.decoded.payload.id,
        },
      };
    },
  });

  await server.register([
    {
      plugin: usersPlugin,
      options: {
        container,
      },
    },
    {
      plugin: authenticationsPlugin,
      options: {
        container,
      },
    },
    {
      plugin: threadsPlugin,
      options: {
        container,
      },
    },
  ]);

  server.ext('onPreResponse', (request: Request, h: ResponseToolkit) => {
    const { response } = request;

    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response);

      if (translatedError instanceof ClientError) {
        return h
          .response({
            status: 'fail',
            message: translatedError.message,
          })
          .code(translatedError.statusCode);
      }

      if (!response.isServer) {
        return h.continue;
      }

      return h
        .response({
          status: 'error',
          message: 'internal server error',
        })
        .code(500);
    }

    return h.continue;
  });

  return server;
};

export { createServer };
