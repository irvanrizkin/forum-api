interface ReplyPayload {
  id: string;
  content: string;
  date: string;
  username: string;
}

class Reply {
  id: string;
  content: string;
  date: string;
  username: string;

  constructor(payload: ReplyPayload) {
    this.verifyPayload(payload);

    const { id, content, date, username } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
  }

  private verifyPayload(payload: ReplyPayload) {
    const { content } = payload;

    if (content === '') {
      throw new Error('REPLY.CONTENT_EMPTY_STRING');
    }
  }
}

export { Reply };
