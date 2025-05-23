import { Server } from '@hapi/hapi';
import { describe, expect, it } from '@jest/globals';

import { container } from '@/infrastructures/container';
import { pool } from '@/infrastructures/database/postgres/pool';
import { createServer } from '@/infrastructures/http/create-server';

import { UsersTableTestHelper } from '@/tests/users-table-test-helper';

describe('/users endpoint', () => {
  let server: Server;

  beforeEach(async () => {
    server = await createServer(container);
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
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
    expect(responseJson.message).toEqual(
      'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada',
    );
  });

  it('should response 400 when request payload is empty object', async () => {
    // Arrange
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
    expect(responseJson.message).toEqual(
      'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada',
    );
  });

  it('should response 400 when request payload data type is wrong', async () => {
    // Arrange
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
    expect(responseJson.message).toEqual(
      'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada',
    );
  });

  it('should response 400 when username more than 50 character', async () => {
    // Arrange
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
    expect(responseJson.message).toEqual(
      'tidak dapat membuat user baru karena karakter username melebihi batas limit',
    );
  });

  it('should response 400 when username contains restricted character', async () => {
    // Arrange
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
      'tidak dapat membuat user baru karena username mengandung karakter terlarang',
    );
  });

  it('should response 400 when username unavailable', async () => {
    // Arrange
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
    expect(responseJson.message).toEqual('username tidak tersedia');
  });
});
