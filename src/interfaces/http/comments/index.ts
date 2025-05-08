import { Server } from '@hapi/hapi';
import { Container } from 'instances-container';

import { CommentsHandler } from '@/interfaces/http/comments/handler';
import { routes } from '@/interfaces/http/comments/routes';

interface CommentPluginOptions {
  container: Container;
}

const commentsPlugin = {
  name: 'comments',
  register: async function (
    server: Server,
    { container }: CommentPluginOptions,
  ) {
    const commentsHandler = new CommentsHandler(container);
    server.route(routes(commentsHandler));
  },
};

export { commentsPlugin };
