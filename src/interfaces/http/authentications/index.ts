import { Server } from '@hapi/hapi';
import { Container } from 'instances-container';

import { AuthenticationsHandler } from '@/interfaces/http/authentications/handler';
import { routes } from '@/interfaces/http/authentications/routes';

interface AuthenticationPluginOptions {
  container: Container;
}

const authenticationsPlugin = {
  name: 'authentications',
  register: async function (
    server: Server,
    { container }: AuthenticationPluginOptions,
  ) {
    const authenticationsHandler = new AuthenticationsHandler(container);
    server.route(routes(authenticationsHandler));
  },
};

export { authenticationsPlugin };
