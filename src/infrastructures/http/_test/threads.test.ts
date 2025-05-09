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
import { ThreadsTableTestHelper } from '@/tests/threads-table-test-helper';
import { UsersTableTestHelper } from '@/tests/users-table-test-helper';

describe('/threads endpoint', () => {
  let server: Server;

  beforeAll(async () => {
    server = await createServer(container);

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'john',
        password: 'password',
        fullname: 'John Doe',
      },
    });
  });

  beforeEach(async () => {
    server = await createServer(container);
  });

  afterAll(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };

      // login
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'john',
          password: 'password',
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread Title',
      };

      // login
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'john',
          password: 'password',
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread karena properti yang dibutuhkan tidak ada/tidak sesuai',
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread Title',
        body: true,
      };

      // login
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'john',
          password: 'password',
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread karena properti yang dibutuhkan tidak ada/tidak sesuai',
      );
    });

    it('should response 400 when request payload is empty object', async () => {
      // Arrange
      const requestPayload = {};

      // login
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'john',
          password: 'password',
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread karena properti yang dibutuhkan tidak ada/tidak sesuai',
      );
    });

    it('should response 401 when request payload not contain valid authentication', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer xxx`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return thread detail', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };

      // login
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'john',
          password: 'password',
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      const { addedThread } = responseJson.data;

      // Action
      const threadResponse = await server.inject({
        method: 'GET',
        url: `/threads/${addedThread.id}`,
      });

      // Assert
      const threadResponseJson = JSON.parse(threadResponse.payload);
      expect(threadResponse.statusCode).toEqual(200);
      expect(threadResponseJson.status).toEqual('success');
      expect(threadResponseJson.data.thread).toBeDefined();
      expect(threadResponseJson.data.thread.id).toEqual(addedThread.id);
      expect(threadResponseJson.data.thread.title).toEqual(
        requestPayload.title,
      );
      expect(threadResponseJson.data.thread.body).toEqual(requestPayload.body);
      expect(threadResponseJson.data.thread.date).toBeDefined();
      expect(threadResponseJson.data.thread.username).toBeDefined();
      expect(threadResponseJson.data.thread.comments).toBeDefined();
      expect(threadResponseJson.data.thread.comments).toEqual([]);
      expect(threadResponseJson.data.thread.comments).toHaveLength(0);
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const threadId = 'thread-123';

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should have comments property with one comment if there is one comment', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };

      // login
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'john',
          password: 'password',
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      const { addedThread } = responseJson.data;

      // Add comment to the thread
      await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: {
          content: 'Comment Content',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Action
      const threadResponse = await server.inject({
        method: 'GET',
        url: `/threads/${addedThread.id}`,
      });

      // Assert
      const threadResponseJson = JSON.parse(threadResponse.payload);
      expect(threadResponse.statusCode).toEqual(200);
      expect(threadResponseJson.status).toEqual('success');
      expect(threadResponseJson.data.thread.comments).toHaveLength(1);
    });

    it('should have comments property with one comment and one reply if there is one comment and one reply', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };

      // login
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'john',
          password: 'password',
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      const { addedThread } = responseJson.data;

      // Add comment to the thread
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: {
          content: 'Comment Content',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const commentResponseJson = JSON.parse(commentResponse.payload);
      const { addedComment } = commentResponseJson.data;

      // Add reply to the comment
      await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: {
          content: 'Reply Content',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Action
      const threadResponse = await server.inject({
        method: 'GET',
        url: `/threads/${addedThread.id}`,
      });

      // Assert
      const threadResponseJson = JSON.parse(threadResponse.payload);
      expect(threadResponse.statusCode).toEqual(200);
      expect(threadResponseJson.status).toEqual('success');
      expect(threadResponseJson.data.thread.comments).toHaveLength(1);
      expect(threadResponseJson.data.thread.comments[0].replies).toHaveLength(
        1,
      );
    });
  });

  it('should remove the content from reply if deleted', async () => {
    // Arrange
    const threadPayload = {
      title: 'Thread Title',
      body: 'Thread Body',
    };
    const commentAndReplyPayload = {
      content: 'Test',
    };

    // login
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'john',
        password: 'password',
      },
    });

    const {
      data: { accessToken },
    } = JSON.parse(loginResponse.payload);

    // Add Thread
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: threadPayload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseJson = JSON.parse(response.payload);
    const { addedThread } = responseJson.data;

    const commentResponse = await server.inject({
      method: 'POST',
      url: `/threads/${addedThread.id}/comments`,
      payload: commentAndReplyPayload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const commentResponseJson = JSON.parse(commentResponse.payload);
    const { addedComment } = commentResponseJson.data;

    // Add Reply
    const replyResponse = await server.inject({
      method: 'POST',
      url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
      payload: commentAndReplyPayload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const replyResponseJson = JSON.parse(replyResponse.payload);
    const { addedReply } = replyResponseJson.data;

    // Delete Reply
    await server.inject({
      method: 'DELETE',
      url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies/${addedReply.id}`,
      headers: {
        Authorization: `Bearer ${JSON.parse(loginResponse.payload).data.accessToken}`,
      },
    });

    const threadResponse = await server.inject({
      method: 'GET',
      url: `/threads/${addedThread.id}`,
    });

    // Assert
    const threadResponseJson = JSON.parse(threadResponse.payload);
    expect(threadResponse.statusCode).toEqual(200);
    expect(threadResponseJson.status).toEqual('success');
    expect(threadResponseJson.data.thread.comments).toHaveLength(1);
    expect(
      threadResponseJson.data.thread.comments[0].replies[0].content,
    ).toEqual('**balasan telah dihapus**');
  });
});
