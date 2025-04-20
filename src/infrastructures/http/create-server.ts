import Hapi, { Request, ResponseToolkit } from '@hapi/hapi';
import { Container } from 'instances-container';

import { config } from '@/commons/config';
import { ClientError } from '@/commons/exceptions/client-error';
import { DomainErrorTranslator } from '@/commons/exceptions/domain-error-translator';

import { usersPlugin } from '@/infrastructures/http/api/users';

const createServer = async (container: Container) => {
  const server = Hapi.server({
    host: config.app.host,
    port: config.app.port,
    debug: config.app.debug,
  });

  await server.register([
    {
      plugin: usersPlugin,
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
