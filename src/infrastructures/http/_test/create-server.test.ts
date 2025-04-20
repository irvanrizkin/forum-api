import { afterAll, afterEach, describe } from '@jest/globals';
import { Container } from 'instances-container';

import { container } from '@/infrastructures/container';
import { pool } from '@/infrastructures/database/postgres/pool';
import { createServer } from '@/infrastructures/http/create-server';

import { UsersTableTestHelper } from '@/tests/users-table-test-helper';

describe('HTTP server', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

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

  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
      const server = await createServer(container);
      const requestPayload = {
        username: 'john',
        password: 'secret',
        fullname: 'John Doe',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedUser.username).toEqual(
        requestPayload.username,
      );
    });
  });

  it('should response 400 when request payload not contain needed property', async () => {
    // Arrange
    const server = await createServer(container);
    const requestPayload = {
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
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('cannot find needed property');
  });

  it('should response 400 when request payload is empty object', async () => {
    // Arrange
    const server = await createServer(container);
    const requestPayload = {};

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('cannot find needed property');
  });

  it('should response 400 when request payload data type is wrong', async () => {
    // Arrange
    const server = await createServer(container);
    const requestPayload = {
      username: 123,
      password: true,
      fullname: 'John Doe',
    };

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('cannot find needed property');
  });

  it('should response 400 when username more than 50 character', async () => {
    // Arrange
    const server = await createServer(container);
    const payload = {
      username: 'john'.repeat(15),
      fullname: 'John Doe',
      password: 'secret',
    };

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('username is too long');
  });

  it('should response 400 when username contains restricted character', async () => {
    // Arrange
    const server = await createServer(container);
    const payload = {
      username: 'john doe',
      fullname: 'John Doe',
      password: 'secret',
    };

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual(
      'username contains restricted character',
    );
  });

  it('should response 400 when username unavailable', async () => {
    // Arrange
    const server = await createServer(container);
    await UsersTableTestHelper.addUser({
      username: 'john',
    });
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
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('username not available');
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
