import { describe, expect, it } from '@jest/globals';
import { Container } from 'instances-container';

import { createServer } from '@/infrastructures/http/create-server';

describe('HTTP server', () => {
  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const emptyContainer = new Container();
    const server = await createServer(emptyContainer);

    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/unregistered-route',
    });

    // Assert
    expect(response.statusCode).toEqual(404);
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const emptyContainer = new Container();
    const server = await createServer(emptyContainer);
    const requestPayload = {
      username: 'john',
      fullname: 'John Doe',
      password: 'secret',
    };

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual('error');
    expect(responseJson.message).toEqual('internal server error');
  });
});
