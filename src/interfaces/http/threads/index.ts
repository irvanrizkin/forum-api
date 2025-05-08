import { Server } from '@hapi/hapi';
import { Container } from 'instances-container';

import { ThreadsHandler } from '@/interfaces/http/threads/handler';
import { routes } from '@/interfaces/http/threads/routes';

interface ThreadPluginOptions {
  container: Container;
}

const threadsPlugin = {
  name: 'threads',
  register: async function (
    server: Server,
    { container }: ThreadPluginOptions,
  ) {
    const threadsHandler = new ThreadsHandler(container);
    server.route(routes(threadsHandler));
  },
};

export { threadsPlugin };
