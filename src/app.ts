import { container } from '@/infrastructures/container';
import { createServer } from '@/infrastructures/http/create-server';

const start = async () => {
  const server = await createServer(container);
  await server.start();
  // eslint-disable-next-line no-console
  console.log(`server is running on ${server.info.uri}`);

  // Hello World
};

start();
