interface AddedReplyPayload {
  id: string;
  content: string;
  owner: string;
}

class AddedReply {
  id: string;
  content: string;
  owner: string;

  constructor(payload: AddedReplyPayload) {
    this.verifyPayload(payload);

    const { id, content, owner } = payload;

    this.id = id;
    this.content = content;
    this.owner = owner;
  }
  private verifyPayload(payload: AddedReplyPayload) {
    const { content, owner } = payload;

    if (content === '') {
      throw new Error('ADD_REPLY.CONTENT_EMPTY_STRING');
    }

    if (owner === '') {
      throw new Error('ADD_REPLY.OWNER_EMPTY_STRING');
    }
  }
}

export { AddedReply };
