import { Server } from '@hapi/hapi';
import { Container } from 'instances-container';

import { RepliesHandler } from '@/interfaces/http/replies/handler';
import { routes } from '@/interfaces/http/replies/routes';

interface ReplyPluginOptions {
  container: Container;
}

const repliesPlugin = {
  name: 'replies',
  register: async function (server: Server, { container }: ReplyPluginOptions) {
    const repliesHandler = new RepliesHandler(container);
    server.route(routes(repliesHandler));
  },
};

export { repliesPlugin };
