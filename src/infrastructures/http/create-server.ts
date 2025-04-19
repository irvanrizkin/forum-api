import Hapi from '@hapi/hapi';
import { Container } from 'instances-container';

import { config } from '@/commons/config';

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

  return server;
};

export { createServer };
