import { Server } from '@hapi/hapi';
import { Container } from 'instances-container';

import { LikesHandler } from '@/interfaces/http/likes/handler';
import { routes } from '@/interfaces/http/likes/routes';

interface LikePluginOptions {
  container: Container;
}

const likesPlugin = {
  name: 'likes',
  register: async function (server: Server, { container }: LikePluginOptions) {
    const likesHandler = new LikesHandler(container);
    server.route(routes(likesHandler));
  },
};

export { likesPlugin };
