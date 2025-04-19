import { ServerRoute } from '@hapi/hapi';

import { UsersHandler } from '@/infrastructures/http/api/users/handler';

const routes = (handler: UsersHandler): ServerRoute[] => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
];

export { routes };
