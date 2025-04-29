import { Server } from '@hapi/hapi';
import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';

import { AuthenticationTokenManager } from '@/applications/security/authentication-token-manager';

import { container } from '@/infrastructures/container';
import { pool } from '@/infrastructures/database/postgres/pool';
import { createServer } from '@/infrastructures/http/create-server';

import { AuthenticationsTableTestHelper } from '@/tests/authentications-table-test-helper';
import { UsersTableTestHelper } from '@/tests/users-table-test-helper';

describe('/authentications endpoint', () => {
  let server: Server;

  beforeEach(async () => {
    server = await createServer(container);
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /authentications', () => {
    it('should response 201 and new authentication', async () => {
      // Arrange
      const requestPayload = {
        username: 'john',
        password: 'secret',
      };
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          fullname: 'John Doe',
          ...requestPayload,
        },
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.accessToken).toBeDefined();
      expect(responseJson.data.refreshToken).toBeDefined();
    });

    it('should response 400 if username not found', async () => {
      // Arrange
      const requestPayload = {
        username: 'john',
        password: 'secret',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('user tidak ditemukan');
    });

    it('should response 401 if password not match', async () => {
      // Arrange
      const requestPayload = {
        username: 'john',
        password: 'wrong_password',
      };
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          fullname: 'John Doe',
          password: 'secret',
          username: requestPayload.username,
        },
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'kredensial yang Anda masukkan salah',
      );
    });

    it('should response 400 if login payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        username: 'john',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat login karena properti yang dibutuhkan tidak ada/tidak sesuai',
      );
    });

    it('should response 400 when request payload is empty object', async () => {
      // Arrange
      const requestPayload = {};

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat login karena properti yang dibutuhkan tidak ada/tidak sesuai',
      );
    });

    it('should response 400 when request payload data type is wrong', async () => {
      // Arrange
      const requestPayload = {
        username: 'john',
        password: 123,
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat login karena properti yang dibutuhkan tidak ada/tidak sesuai',
      );
    });
  });

  describe('when PUT /authentications', () => {
    it('should response 200 and new access token', async () => {
      // Arrange
      const payload = {
        username: 'john',
        password: 'secret',
      };
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          fullname: 'John Doe',
          ...payload,
        },
      });
      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload,
      });
      const {
        data: { refreshToken },
      } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.accessToken).toBeDefined();
    });

    it('should return 400 if payload not contain refresh token', async () => {
      // Arrange
      const payload = {};

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat memperbarui token karena properti yang dibutuhkan tidak ada/tidak sesuai',
      );
    });

    it('should return 400 if refresh token not string', async () => {
      // Arrange
      const payload = {
        refreshToken: 123,
      };

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat memperbarui token karena properti yang dibutuhkan tidak ada/tidak sesuai',
      );
    });

    it('should response 400 if refresh token not valid', async () => {
      // Arrange
      const refreshToken = 'not_token';

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak valid');
    });

    it('should response 400 if refresh token not registered in database', async () => {
      // Arrange
      const refreshToken = await container
        .getInstance(AuthenticationTokenManager.name)
        .createRefreshToken({
          username: 'john',
        });

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'refresh token tidak ditemukan di database',
      );
    });
  });

  describe('when DELETE /authentications', () => {
    it('should response 200 if refresh token valid', async () => {
      // Arrange
      const refreshToken = 'refresh_token';
      await AuthenticationsTableTestHelper.addToken(refreshToken);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 400 if refresh token not registered in database', async () => {
      // Arrange
      const refreshToken = 'refresh_token';

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'refresh token tidak ditemukan di database',
      );
    });

    it('should return 400 if payload not contain refresh token', async () => {
      // Arrange
      const payload = {};

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat menghapus token karena properti yang dibutuhkan tidak ada/tidak sesuai',
      );
    });

    it('should return 400 if refresh token not string', async () => {
      // Arrange
      const payload = {
        refreshToken: 123,
      };

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat menghapus token karena properti yang dibutuhkan tidak ada/tidak sesuai',
      );
    });
  });
});
