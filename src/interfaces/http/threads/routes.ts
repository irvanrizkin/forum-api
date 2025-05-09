import { ServerRoute } from '@hapi/hapi';

import { ThreadsHandler } from '@/interfaces/http/threads/handler';

const routes = (handler: ThreadsHandler): ServerRoute[] => [
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.getThreadHandler,
  },
];

export { routes };
