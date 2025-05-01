interface AddCommentPayload {
  content: string;
}

class AddComment {
  content: string;

  constructor(payload: AddCommentPayload) {
    this.verifyPayload(payload);

    const { content } = payload;

    this.content = content;
  }

  private verifyPayload(payload: AddCommentPayload) {
    const { content } = payload;

    if (content === '') {
      throw new Error('ADD_COMMENT.CONTENT_EMPTY_STRING');
    }
  }
}

export { AddComment };
