import { ServerRoute } from '@hapi/hapi';

import { CommentsHandler } from '@/interfaces/http/comments/handler';

const routes = (handler: CommentsHandler): ServerRoute[] => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postCommentHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteCommentHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
];

export { routes };
