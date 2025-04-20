import { ServerRoute } from '@hapi/hapi';

import { UsersHandler } from '@/interfaces/http/users/handler';

const routes = (handler: UsersHandler): ServerRoute[] => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
];

export { routes };
