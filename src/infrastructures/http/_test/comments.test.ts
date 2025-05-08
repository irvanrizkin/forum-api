import { Server } from '@hapi/hapi';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';

import { container } from '@/infrastructures/container';
import { pool } from '@/infrastructures/database/postgres/pool';
import { createServer } from '@/infrastructures/http/create-server';

import { AuthenticationsTableTestHelper } from '@/tests/authentications-table-test-helper';
import { CommentsTableTestHelper } from '@/tests/comments-table-test-helper';
import { ThreadsTableTestHelper } from '@/tests/threads-table-test-helper';
import { UsersTableTestHelper } from '@/tests/users-table-test-helper';

describe('/comments endpoint', () => {
  let server: Server;
  let threadId: string;

  beforeAll(async () => {
    server = await createServer(container);

    // Create a user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'john',
        password: 'password',
        fullname: 'John Doe',
      },
    });

    // Login the user
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'john',
        password: 'password',
      },
    });

    // Create a thread
    const threadResponse = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'Thread Title',
        body: 'Thread Body',
      },
      headers: {
        Authorization: `Bearer ${JSON.parse(loginResponse.payload).data.accessToken}`,
      },
    });
    const threadResponseJson = JSON.parse(threadResponse.payload);
    threadId = threadResponseJson.data.addedThread.id;

    // Create Jane
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'jane',
        password: 'password',
        fullname: 'Jane Doe',
      },
    });
  });

  beforeEach(async () => {
    server = await createServer(container);
  });

  afterAll(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'Comment Content',
      };

      // Login John
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'john',
          password: 'password',
        },
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${JSON.parse(loginResponse.payload).data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment.content).toEqual(
        requestPayload.content,
      );
    });

    it('should response 400 when request payload does not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'Comment Title',
      };

      // Login John
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'john',
          password: 'password',
        },
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${JSON.parse(loginResponse.payload).data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat komentar karena properti yang dibutuhkan tidak ada/tidak sesuai',
      );
    });

    it('should response 400 when request payload is empty object', async () => {
      // Arrange
      const requestPayload = {};

      // Login John
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'john',
          password: 'password',
        },
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${JSON.parse(loginResponse.payload).data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat komentar karena properti yang dibutuhkan tidak ada/tidak sesuai',
      );
    });

    it('should response 400 when request payload not met data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: 123,
      };

      // Login John
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'john',
          password: 'password',
        },
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${JSON.parse(loginResponse.payload).data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat komentar karena properti yang dibutuhkan tidak ada/tidak sesuai',
      );
    });

    it('should response 404 when threadId not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'Comment Content',
      };

      // Login John
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'john',
          password: 'password',
        },
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/invalid-thread-id/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${JSON.parse(loginResponse.payload).data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 401 when request payload not contain authentication', async () => {
      // Arrange
      const requestPayload = {
        content: 'Comment Content',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });
});
