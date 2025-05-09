import { ServerRoute } from '@hapi/hapi';

import { RepliesHandler } from '@/interfaces/http/replies/handler';

const routes = (handler: RepliesHandler): ServerRoute[] => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.postReplyHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler: handler.deleteReplyHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
];

export { routes };
