interface AddReplyPayload {
  content: string;
}

class AddReply {
  content: string;

  constructor(payload: AddReplyPayload) {
    this.verifyPayload(payload);

    const { content } = payload;

    this.content = content;
  }

  private verifyPayload(payload: AddReplyPayload): void {
    const { content } = payload;

    if (content === '') {
      throw new Error('REPLY.CONTENT_EMPTY_STRING');
    }
  }
}

export { AddReply };
