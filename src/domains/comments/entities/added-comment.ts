interface AddedCommentPayload {
  id: string;
  content: string;
  owner: string;
}

class AddedComment {
  id: string;
  content: string;
  owner: string;

  constructor(payload: AddedCommentPayload) {
    this.verifyPayload(payload);

    const { id, content, owner } = payload;

    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  private verifyPayload(payload: AddedCommentPayload) {
    const { content, owner } = payload;

    if (content === '') {
      throw new Error('ADD_COMMENT.CONTENT_EMPTY_STRING');
    }

    if (owner === '') {
      throw new Error('ADD_COMMENT.OWNER_EMPTY_STRING');
    }
  }
}

export { AddedComment };
