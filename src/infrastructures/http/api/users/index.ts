import { Server } from '@hapi/hapi';
import { Container } from 'instances-container';

import { UsersHandler } from '@/infrastructures/http/api/users/handler';
import { routes } from '@/infrastructures/http/api/users/routes';

interface UserPluginOptions {
  container: Container;
}

const usersPlugin = {
  name: 'users',
  register: async function (server: Server, { container }: UserPluginOptions) {
    const userHandler = new UsersHandler(container);
    server.route(routes(userHandler));
  },
};

export { usersPlugin };
