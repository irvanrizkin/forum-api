import { ServerRoute } from '@hapi/hapi';

import { LikesHandler } from '@/interfaces/http/likes/handler';

const routes = (handler: LikesHandler): ServerRoute[] => [
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.putLikeCommentHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
];

export { routes };
